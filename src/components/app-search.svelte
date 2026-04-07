<script lang="ts">
    // — logic unchanged —
    import { onMount, tick } from "svelte";
    import { useSearch } from "~/composables/use-search";
    import type { SearchResult } from "~/lib/search";

    let open = $state(false);
    let query = $state("");
    let results = $state<SearchResult[]>([]);
    let loading = $state(false);
    let error = $state<string | null>(null);

    let searcher: ReturnType<typeof useSearch> | null = null;
    let inputEl = $state<HTMLInputElement | null>(null);
    let dialogEl = $state<HTMLElement | null>(null);
    let triggerEl = $state<HTMLButtonElement | null>(null);

    async function init() {
        if (searcher || loading) return;
        loading = true;
        error = null;
        try {
            const { decode } = await import("@msgpack/msgpack");
            const buffer = await fetch("/search-index.bin").then((r) =>
                r.arrayBuffer(),
            );
            const docs = decode(
                buffer,
            ) as import("~/lib/search").SearchDocument[];
            searcher = useSearch(docs);
            updateResults();
        } catch (err) {
            error =
                err instanceof Error
                    ? err.message
                    : "Unable to load search index.";
        } finally {
            loading = false;
        }
    }

    function updateResults() {
        results = searcher ? searcher(query, 12) : [];
    }

    async function openDialog() {
        open = true;
        await init();
        await tick();
        inputEl?.focus();
        inputEl?.select();
    }

    function closeDialog() {
        open = false;
        query = "";
        results = [];
        error = null;
        triggerEl?.focus();
    }

    function toggle() {
        if (open) {
            closeDialog();
            return;
        }
        void openDialog();
    }

    function onInput(e: Event) {
        query = (e.currentTarget as HTMLInputElement).value;
        updateResults();
    }

    function stopPropagation(e: Event) {
        e.stopPropagation();
    }

    function onBackdropClick(e: MouseEvent) {
        if (e.target === e.currentTarget) closeDialog();
    }

    const CATEGORY_ORDER = [
        "pages",
        "writings",
        "blogroll",
        "bookmarks",
        "podroll",
        "verify",
        "go",
    ];
    const CATEGORY_LABELS: Record<string, string> = {
        pages: "Pages",
        writings: "Writings",
        blogroll: "Blogroll",
        bookmarks: "Bookmarks",
        podroll: "Podroll",
        verify: "Verify",
        go: "Go",
    };

    let groupedResults = $derived.by(() => {
        if (!results.length) return [];
        const groups = new Map<string, SearchResult[]>();
        for (const r of results) {
            const cat = r.category ?? "other";
            if (!groups.has(cat)) groups.set(cat, []);
            groups.get(cat)!.push(r);
        }
        const sorted = [...groups.entries()].sort((a, b) => {
            const ai = CATEGORY_ORDER.indexOf(a[0]);
            const bi = CATEGORY_ORDER.indexOf(b[0]);
            if (ai === -1 && bi === -1) return a[0].localeCompare(b[0]);
            if (ai === -1) return 1;
            if (bi === -1) return -1;
            return ai - bi;
        });
        return sorted.map(([category, items]) => ({ category, items }));
    });

    function isExternal(category: string) {
        return category !== "pages" && category !== "writings";
    }

    function onDialogKeydown(e: KeyboardEvent) {
        if (e.key !== "Tab") return;
        const focusable = dialogEl?.querySelectorAll<HTMLElement>(
            'input, button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    function onKeydown(e: KeyboardEvent) {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            toggle();
            return;
        }
        if (!open) return;
        if (e.key === "Escape") {
            e.preventDefault();
            closeDialog();
            return;
        }
    }

    onMount(() => {
        document.addEventListener("keydown", onKeydown);
        return () => document.removeEventListener("keydown", onKeydown);
    });

    $effect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    });
</script>

<!-- Trigger — matches Button outline/sm -->
<div>
    <button
        bind:this={triggerEl}
        onclick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        class="inline-flex items-center gap-2 border border-default
           px-2 py-1 text-sm hover:border-background text-muted
           hover:bg-foreground hover:text-background cursor-pointer focus-visible:outline-none
           focus-visible:ring-2 focus-visible:ring-primary/40"
    >
        <span
            class="i-gg:search inline-flex shrink-0 size-3.5"
            aria-hidden="true"
        ></span>
        Search
        <span class="inline-flex items-center gap-0.5" aria-hidden="true">
            <kbd
                class="inline-flex items-center justify-center border border-default
                  px-1 py-0.5 font-mono text-xs font-medium leading-none
                  select-none">⌘</kbd
            >
            <kbd
                class="inline-flex items-center justify-center border border-default
                  px-1 py-0.5 font-mono text-xs font-medium leading-none
                  select-none">K</kbd
            >
        </span>
    </button>

    {#if open}
        <!-- Overlay -->
        <div
            class="fixed inset-0 z-50 bg-black/50 dark:bg-black/70"
            onclick={onBackdropClick}
            role="presentation"
        >
            <!-- Dialog -->
            <div
                bind:this={dialogEl}
                role="dialog"
                aria-modal="true"
                aria-label="Search"
                class="mx-auto mt-[6vh] flex max-h-[88dvh] w-full max-w-2xl flex-col overflow-hidden
               border border-neutral-200 bg-white shadow-xl
               dark:border-neutral-800 dark:bg-neutral-950"
                onpointerdown={stopPropagation}
                onkeydown={onDialogKeydown}
            >
                <!-- Input row -->
                <div
                    class="flex items-stretch border-b border-neutral-200 dark:border-neutral-800 shrink-0"
                >
                    <span
                        class="flex w-12 shrink-0 items-center justify-center
                       border-r border-neutral-200 dark:border-neutral-800
                       text-neutral-400 dark:text-neutral-600"
                    >
                        <span class="i-gg:search size-4" aria-hidden="true"
                        ></span>
                    </span>

                    <input
                        bind:this={inputEl}
                        value={query}
                        oninput={onInput}
                        type="search"
                        placeholder="Search…"
                        autocomplete="off"
                        spellcheck="false"
                        class="search-input flex-1 bg-transparent px-4 py-3.5 text-base
                   font-sans text-neutral-900 placeholder:text-neutral-400
                   outline-none
                   dark:text-neutral-100 dark:placeholder:text-neutral-600"
                    />

                    <button
                        onclick={closeDialog}
                        aria-label="Close"
                        class="flex w-12 shrink-0 items-center justify-center
                   border-l border-neutral-200 dark:border-neutral-800
                   text-neutral-400 transition-colors
                   hover:bg-neutral-100 hover:text-neutral-900
                   dark:text-neutral-600 dark:hover:bg-neutral-900 dark:hover:text-neutral-100
                   focus-visible:outline-none focus-visible:ring-inset
                   focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        <span class="i-gg:close size-4" aria-hidden="true"
                        ></span>
                    </button>
                </div>

                <!-- Results pane -->
                <div class="min-h-0 flex-1 overflow-y-auto" role="listbox">
                    {#if loading}
                        <p
                            class="flex items-center gap-2 px-5 py-6 text-sm text-neutral-500 dark:text-neutral-500"
                        >
                            <span
                                class="spinner size-3.5 shrink-0"
                                aria-hidden="true"
                            ></span>
                            Loading index…
                        </p>
                    {:else if error}
                        <p
                            class="px-5 py-6 text-sm text-red-600 dark:text-red-400"
                        >
                            Search unavailable.
                        </p>
                    {:else if query.trim().length === 0}
                        <p
                            class="px-5 py-6 text-sm text-neutral-500 dark:text-neutral-500"
                        >
                            Start typing to search.
                        </p>
                    {:else if results.length === 0}
                        <p
                            class="px-5 py-6 text-sm text-neutral-500 dark:text-neutral-500"
                        >
                            No results for <strong
                                class="text-neutral-900 dark:text-neutral-100"
                                >{query}</strong
                            >
                        </p>
                    {:else}
                        {#each groupedResults as group}
                            <!-- Section header -->
                            <p
                                class="border-b border-neutral-100 px-4 py-1.5 font-mono text-[10px]
                        uppercase tracking-widest text-neutral-400
                        dark:border-neutral-900 dark:text-neutral-600"
                            >
                                {CATEGORY_LABELS[group.category] ??
                                    group.category}
                                <span class="opacity-60"
                                    >({group.items.length})</span
                                >
                            </p>

                            <ul>
                                {#each group.items as { url, title, description, icon }, i (url)}
                                    <li>
                                        <a
                                            href={url}
                                            onclick={closeDialog}
                                            data-search-result={url}
                                            role="option"
                                            class="group flex items-stretch border-b border-neutral-100
                             border-l-2 border-l-transparent text-left no-underline outline-none
                             transition-colors
                             focus-visible:border-l-primary focus-visible:bg-neutral-50
                             dark:border-neutral-900 dark:hover:bg-neutral-900
                             hover:border-l-primary/40 hover:bg-neutral-50
                             dark:focus-visible:border-l-primary dark:focus-visible:bg-neutral-900"
                                        >
                                            <!-- Icon cell -->
                                            <span
                                                class="flex w-12 shrink-0 items-center justify-center
                                   border-r border-neutral-100 font-mono text-sm
                                   text-primary dark:border-neutral-900"
                                            >
                                                {#if icon}
                                                    <span
                                                        class="{icon} size-6"
                                                        aria-hidden="true"
                                                    ></span>
                                                {:else}
                                                <span
                                                    class="i-gg:link size-6"
                                                    aria-hidden="true"
                                                ></span>
                                                {/if}
                                            </span>

                                            <!-- Body -->
                                            <span
                                                class="flex min-w-0 flex-1 flex-col gap-0.5 px-4 py-3"
                                            >
                                                {#if isExternal(group.category)}
                                                    <span
                                                        class="text-[10px] font-mono uppercase tracking-wider
                                       text-neutral-400 dark:text-neutral-600"
                                                    >
                                                        {CATEGORY_LABELS[
                                                            group.category
                                                        ] ?? group.category}
                                                    </span>
                                                {/if}
                                                <span
                                                    class="text-sm font-medium tracking-tight
                                     text-neutral-900 dark:text-neutral-100"
                                                >
                                                    {title}
                                                </span>
                                                {#if description}
                                                    <span
                                                        class="line-clamp-2 text-xs leading-relaxed
                                       text-neutral-500 dark:text-neutral-500"
                                                    >
                                                        {description}
                                                    </span>
                                                {/if}
                                                <span
                                                    class="mt-1 truncate font-mono text-[11px]
                                     text-neutral-400 dark:text-neutral-600"
                                                >
                                                    {url}
                                                </span>
                                            </span>
                                        </a>
                                    </li>
                                {/each}
                            </ul>
                        {/each}
                    {/if}
                </div>

                <!-- Footer keyboard hints — Kbd sm style -->
                <div
                    class="flex shrink-0 items-center gap-4 border-t border-neutral-200
                    px-4 py-2 dark:border-neutral-800"
                    aria-hidden="true"
                >
                    {#each [{ keys: ["Tab"], label: "navigate" }, { keys: ["↵"], label: "open" }, { keys: ["Esc"], label: "close" }] as hint}
                        <span
                            class="inline-flex items-center gap-1 font-mono text-xs text-neutral-400 dark:text-neutral-600"
                        >
                            {#each hint.keys as key}
                                <kbd
                                    class="inline-flex items-center justify-center rounded-sm border
                            border-primary/50 bg-transparent px-1 py-0.5 font-mono
                            text-xs font-medium leading-none text-primary select-none"
                                >
                                    {key}
                                </kbd>
                            {/each}
                            {hint.label}
                        </span>
                    {/each}
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Hide browser's native ✕ on search inputs */
    .search-input::-webkit-search-cancel-button {
        display: none;
    }

    /* Spinner — only animation, everything else is Tailwind */
    .spinner {
        border: 1.5px solid theme("colors.neutral.200");
        border-top-color: theme("colors.primary.DEFAULT");
        border-radius: 9999px;
        animation: spin 600ms linear infinite;
    }
    :global(.dark) .spinner {
        border-color: theme("colors.neutral.800");
        border-top-color: theme("colors.primary.DEFAULT");
    }
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>
