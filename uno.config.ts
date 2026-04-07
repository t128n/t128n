import { readFileSync } from "node:fs";

import { globSync } from "tinyglobby";
import {
	defineConfig,
	presetWind4,
	presetTypography,
	presetIcons,
} from "unocss";

const verifyData = readFileSync("./src/content/data/verify.json", "utf-8");
const writingsData = globSync("./src/content/writings/**/*.{md,mdx}").map(
	(path) => readFileSync(path, "utf-8"),
);
const searchIndexData = readFileSync(
	"./src/pages/search-index.bin.ts",
	"utf-8",
);

export default defineConfig({
	presets: [
		presetWind4({ dark: "media" }),
		presetTypography(),
		presetIcons(),
	],
	theme: {
		font: {
			sans: "var(--font-ia-writer-duo), ui-sans-serif, system-ui, sans-serif",
			mono: "var(--font-ia-writer-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
		},
	},
	preflights: [
		{
			getCSS: ({ theme }) => {
				const colors = (theme as { colors: Record<string, unknown> })
					.colors;
				const shade = (name: string, value: number) =>
					(colors[name] as Record<number, string>)[value];
				const solid = (name: string) => colors[name] as string;

				return `
          :root {
            --color-primary:    ${shade("zinc", 950)};
            --color-secondary:  ${shade("violet", 500)};
            --color-success:    ${shade("green", 500)};
            --color-info:       ${shade("sky", 500)};
            --color-warning:    ${shade("orange", 500)};
            --color-error:      ${shade("red", 500)};

            --color-inverted:   ${shade("zinc", 950)};
            --color-default:    ${solid("white")};
            --color-elevated:   ${shade("zinc", 100)};
            --color-accented:   ${shade("zinc", 200)};
            --color-muted:      ${shade("zinc", 500)};
            --color-dimmed:     ${shade("zinc", 400)};
            --color-soft:       ${shade("zinc", 100)};
            --color-background: ${shade("zinc", 50)};
            --color-foreground: ${shade("zinc", 950)};
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --color-primary:    ${shade("zinc", 50)};
              --color-secondary:  ${shade("violet", 400)};
              --color-success:    ${shade("green", 400)};
              --color-info:       ${shade("sky", 400)};
              --color-warning:    ${shade("orange", 400)};
              --color-error:      ${shade("red", 400)};

              --color-inverted:   ${shade("zinc", 50)};
              --color-default:    ${shade("zinc", 900)};
              --color-elevated:   ${shade("zinc", 800)};
              --color-accented:   ${shade("zinc", 700)};
              --color-muted:      ${shade("zinc", 400)};
              --color-dimmed:     ${shade("zinc", 500)};
              --color-soft:       ${shade("zinc", 800)};
              --color-background: ${shade("zinc", 950)};
              --color-foreground: ${shade("zinc", 50)};
            }
          }
        `;
			},
		},
	],

	extendTheme: (theme) => {
		const t = theme as any;

		t.colors.primary = { DEFAULT: "var(--color-primary)" };
		t.colors.secondary = { DEFAULT: "var(--color-secondary)" };
		t.colors.success = { DEFAULT: "var(--color-success)" };
		t.colors.info = { DEFAULT: "var(--color-info)" };
		t.colors.warning = { DEFAULT: "var(--color-warning)" };
		t.colors.error = { DEFAULT: "var(--color-error)" };

		t.colors.inverted = { DEFAULT: "var(--color-inverted)" };
		t.colors.elevated = { DEFAULT: "var(--color-elevated)" };
		t.colors.accented = { DEFAULT: "var(--color-accented)" };
		t.colors.muted = { DEFAULT: "var(--color-muted)" };
		t.colors.dimmed = { DEFAULT: "var(--color-dimmed)" };
		t.colors.soft = { DEFAULT: "var(--color-soft)" };
		t.colors.background = { DEFAULT: "var(--color-background)" };
		t.colors.foreground = { DEFAULT: "var(--color-foreground)" };
	},

	shortcuts: {
		"bg-default": "bg-[var(--color-default)]",
		"bg-soft": "bg-[var(--color-soft)]",
		"text-default": "text-[var(--color-foreground)]",
		"text-inverted": "text-[var(--color-background)]",
		"ring-accented": "ring-[var(--color-accented)]",
		"border-default": "border-zinc-200 dark:border-zinc-800",
	},
	content: {
		inline: [verifyData, ...writingsData, searchIndexData],
	},
});
