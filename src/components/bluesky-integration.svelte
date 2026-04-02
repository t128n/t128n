<script lang="ts">
    import { onMount } from "svelte";
    import { Client, simpleFetchHandler } from "@atcute/client";
    import type {} from "@atcute/bluesky";

    type Props = {
        blueskyUrl: string;
    };

    type CommentNode = {
        uri: string;
        cid: string;
        record?: {
            text?: string;
            createdAt?: string;
        };
        author?: {
            handle?: string;
            displayName?: string;
            avatar?: string;
        };
        likeCount?: number;
        repostCount?: number;
        replyCount?: number;
        replies?: CommentNode[];
    };

    type ThreadNode = {
        post?: CommentNode;
        replies?: ThreadNode[];
    };

    type ThreadStats = {
        replyCount: number;
        repostCount: number;
        likeCount: number;
    };

    const { blueskyUrl } = $props<Props>();

    let loading = $state(false);
    let error = $state<string | null>(null);
    let comments = $state<CommentNode[]>([]);
    let stats = $state<ThreadStats | null>(null);

    const rpc = new Client({
        handler: simpleFetchHandler({ service: "https://public.api.bsky.app" }),
    });

    function toAtUri(input: string) {
        if (input.startsWith("at://")) return input;
        const parsed = new URL(input);
        const parts = parsed.pathname.split("/").filter(Boolean);
        if (
            parsed.hostname === "bsky.app" &&
            parts[0] === "profile" &&
            parts[2] === "post" &&
            parts[1] &&
            parts[3]
        ) {
            return `at://${parts[1]}/app.bsky.feed.post/${parts[3]}`;
        }
        if (parts.length >= 3) {
            return `at://${parts[0]}/${parts[1]}/${parts[2]}`;
        }
        throw new Error("Invalid Bluesky post URL.");
    }

    function toComments(nodes: ThreadNode[] | undefined): CommentNode[] {
        return (nodes ?? [])
            .map((node) => {
                if (!node.post) return null;
                return {
                    ...node.post,
                    replies: toComments(node.replies),
                };
            })
            .filter((node): node is CommentNode => node !== null);
    }

    function toBskyUrl(uri: string) {
        if (!uri.startsWith("at://")) return uri;
        const parts = uri.slice(5).split("/").filter(Boolean);
        if (parts.length < 3) return uri;
        return `https://bsky.app/profile/${parts[0]}/post/${parts[2]}`;
    }

    async function loadComments() {
        loading = true;
        error = null;
        try {
            const uri = toAtUri(blueskyUrl);
            const response = await rpc.get("app.bsky.feed.getPostThread", {
                params: { uri },
            });
            if (!response.ok) {
                throw new Error(
                    response.data.message ?? "Unable to load Bluesky comments.",
                );
            }
            const thread = response.data.thread as ThreadNode | undefined;
            comments = toComments(thread?.replies);
            stats = thread?.post
                ? {
                      replyCount: thread.post.replyCount ?? 0,
                      repostCount: thread.post.repostCount ?? 0,
                      likeCount: thread.post.likeCount ?? 0,
                  }
                : null;
        } catch (err) {
            error =
                err instanceof Error
                    ? err.message
                    : "Unable to load Bluesky comments.";
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        void loadComments();
    });
</script>

{#snippet commentItem(comment: CommentNode)}
    <li class="border-l border-default pl-4">
        <a
            href={toBskyUrl(comment.uri)}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open post by ${comment.author?.displayName ?? comment.author?.handle ?? "Unknown author"} on Bluesky`}
            class="block rounded-sm transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
            <div class="flex items-start gap-3">
                {#if comment.author?.avatar}
                    <img
                        src={comment.author.avatar}
                        alt=""
                        class="size-10 rounded-full object-cover"
                        loading="lazy"
                    />
                {/if}
                <div class="min-w-0 flex-1">
                    <div
                        class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm"
                    >
                        <span class="font-medium text-primary"
                            >{comment.author?.displayName ??
                                comment.author?.handle ??
                                "Unknown"}</span
                        >
                        {#if comment.author?.handle}
                            <span class="text-muted"
                                >@{comment.author.handle}</span
                            >
                        {/if}
                        {#if comment.record?.createdAt}
                            <time
                                class="text-xs text-muted"
                                datetime={comment.record.createdAt}
                            >
                                {new Date(
                                    comment.record.createdAt,
                                ).toLocaleDateString()}
                            </time>
                        {/if}
                    </div>
                    {#if comment.record?.text}
                        <p class="mt-2 whitespace-pre-wrap text-sm leading-6">
                            {comment.record.text}
                        </p>
                    {/if}
                    <div class="mt-2 flex gap-4 text-xs text-muted">
                        <span>{comment.replyCount ?? 0} replies</span>
                        <span>{comment.repostCount ?? 0} reposts</span>
                        <span>{comment.likeCount ?? 0} likes</span>
                    </div>
                </div>
            </div>
        </a>
        {#if comment.replies?.length}
            <ul class="mt-4 space-y-4">
                {#each comment.replies as reply}
                    {@render commentItem(reply)}
                {/each}
            </ul>
        {/if}
    </li>
{/snippet}

<section class="mt-10 border-t border-default pt-4">
    <div class="flex flex-wrap items-center justify-between text-sm text-muted">
        {#if stats}
            <div class="flex gap-3 items-center">
                <span>{stats.replyCount} replies</span>
                <span>{stats.repostCount} reposts</span>
                <span>{stats.likeCount} likes</span>
            </div>
        {/if}
        <a
            href={blueskyUrl}
            target="_blank"
            rel="noreferrer"
            class="inline-flex text-primary hover:underline flex items-center gap-1"
        >
            <span class="i-simple-icons:bluesky inline-block"></span>
            <span>
                {comments.length === 0 ? "Start" : "Join"} the conversation on Bluesky.
            </span>
        </a>
    </div>
    {#if loading}
        <p class="mt-3 text-sm text-muted">Loading comments...</p>
    {:else if error}
        <p class="mt-3 text-sm text-muted">{error}</p>
    {:else}
        <ul class="mt-6 space-y-6">
            {#each comments as comment}
                {@render commentItem(comment)}
            {/each}
        </ul>
    {/if}
</section>
