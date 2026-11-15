/**
 * Pixel glyphs in the style of the t128n wordmark: a 5-row grid, 1-cell
 * strokes and a 22% shadow cell inside counters.
 *
 * Patterns: '#' ink, '.' empty. Glyphs shorter than 5 rows sit on the baseline.
 * Shadows are derived by rule (see `shadowCells`), not stored.
 */
export const GLYPHS: Record<string, readonly string[]> = {
  "0": ["###", "#.#", "#.#", "#.#", "###"],
  "1": ["##", ".#", ".#", ".#", ".#"],
  "2": ["###", "..#", "###", "#..", "###"],
  "3": ["###", "..#", "###", "..#", "###"],
  "4": ["#.#", "#.#", "###", "..#", "..#"],
  "5": ["###", "#..", "###", "..#", "###"],
  "6": ["###", "#..", "###", "#.#", "###"],
  "7": ["###", "..#", "..#", "..#", "..#"],
  "8": ["###", "#.#", "###", "#.#", "###"],
  "9": ["###", "#.#", "###", "..#", "###"],

  A: [".#.", "#.#", "###", "#.#", "#.#"],
  B: ["##.", "#.#", "##.", "#.#", "##."],
  C: ["###", "#..", "#..", "#..", "###"],
  D: ["##.", "#.#", "#.#", "#.#", "##."],
  E: ["###", "#..", "###", "#..", "###"],
  F: ["###", "#..", "###", "#..", "#.."],
  G: ["###", "#..", "#.#", "#.#", "###"],
  H: ["#.#", "#.#", "###", "#.#", "#.#"],
  I: ["###", ".#.", ".#.", ".#.", "###"],
  J: ["..#", "..#", "..#", "#.#", "###"],
  K: ["#.#", "#.#", "##.", "#.#", "#.#"],
  L: ["#..", "#..", "#..", "#..", "###"],
  M: ["#...#", "##.##", "#.#.#", "#...#", "#...#"],
  N: ["#..#", "##.#", "#.##", "#..#", "#..#"],
  O: ["###", "#.#", "#.#", "#.#", "###"],
  P: ["###", "#.#", "###", "#..", "#.."],
  Q: ["###", "#.#", "#.#", "###", "..#"],
  R: ["###", "#.#", "##.", "#.#", "#.#"],
  S: ["###", "#..", "###", "..#", "###"],
  T: ["###", ".#.", ".#.", ".#.", ".#."],
  U: ["#.#", "#.#", "#.#", "#.#", "###"],
  V: ["#.#", "#.#", "#.#", "#.#", ".#."],
  W: ["#...#", "#...#", "#.#.#", "##.##", "#...#"],
  X: ["#.#", "#.#", ".#.", "#.#", "#.#"],
  Y: ["#.#", "#.#", ".#.", ".#.", ".#."],
  Z: ["###", "..#", ".#.", "#..", "###"],

  a: ["###", "..#", "###", "###"],
  b: ["#..", "###", "#.#", "#.#", "###"],
  c: ["###", "#..", "#..", "###"],
  d: ["..#", "###", "#.#", "#.#", "###"],
  e: ["###", "#.#", "##.", "###"],
  f: [".##", "#..", "###", "#..", "#.."],
  g: ["###", "#.#", "###", "..#"],
  h: ["#..", "#..", "###", "#.#", "#.#"],
  i: ["#", ".", "#", "#", "#"],
  j: ["..#", "...", "..#", "#.#", "###"],
  k: ["#..", "#.#", "##.", "#.#", "#.#"],
  l: ["#.", "#.", "#.", "#.", "##"],
  m: ["#####", "#.#.#", "#.#.#", "#.#.#"],
  n: ["###", "#.#", "#.#", "#.#"],
  o: ["###", "#.#", "#.#", "###"],
  p: ["###", "#.#", "###", "#.."],
  q: ["###", "#.#", "###", "..#"],
  r: ["###", "#..", "#..", "#.."],
  s: ["###", "##.", ".##", "###"],
  t: ["#..", "###", "#..", "#..", "###"],
  u: ["#.#", "#.#", "#.#", "###"],
  v: ["#.#", "#.#", "#.#", ".#."],
  w: ["#.#.#", "#.#.#", "#.#.#", "#####"],
  x: ["#.#", ".#.", ".#.", "#.#"],
  y: ["#.#", "#.#", "###", "..#"],
  z: ["###", "..#", ".#.", "###"],

  ".": [".", ".", ".", ".", "#"],
  "-": ["...", "...", "###", "...", "..."],
  _: ["...", "...", "...", "...", "###"],
  ":": [".", "#", ".", "#", "."],
  "/": ["..#", "..#", ".#.", "#..", "#.."],
  "!": ["#", "#", "#", ".", "#"],
  "<": ["..#", ".#.", "#..", ".#.", "..#"],
  ">": ["#..", ".#.", "..#", ".#.", "#.."],
  "[": ["##", "#.", "#.", "#.", "##"],
  "]": ["##", ".#", ".#", ".#", "##"],
  "{": [".##", ".#.", "#..", ".#.", ".##"],
  "}": ["##.", ".#.", "..#", ".#.", "##."],
  "~": ["....", ".#.#", "#.#.", "....", "...."],
  $: [".#.", "###", "##.", ".##", "###"],
  '"': ["#.#", "#.#", "...", "...", "..."],
  "'": ["#", "#", ".", ".", "."],
  "`": ["#..", ".#.", "...", "...", "..."],
};

/** Characters in specimen order, grouped for the glyph table. */
export const GROUPS: ReadonlyArray<{ label: string; chars: string }> = [
  { label: "digits", chars: "0123456789" },
  { label: "uppercase", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
  { label: "lowercase", chars: "abcdefghijklmnopqrstuvwxyz" },
  { label: "punctuation", chars: ".-_:/!<>[]{}~$\"'`" },
];

export const ROWS = 5;
/** Empty cells between glyphs. */
export const TRACKING = 1;
/** Width of a space, in cells. */
export const SPACE = 3;
/** Shadow opacity, matching the wordmark. */
export const SHADOW_OPACITY = 0.22;

type Cell = "#" | "." | "s";

export interface Bitmap {
  width: number;
  /** ROWS x width grid of ink, empty and shadow cells. */
  cells: Cell[][];
}

/** Pad a pattern to a ROWS x width grid, baseline-aligned. */
function pad(pattern: readonly string[]): Cell[][] {
  const width = Math.max(...pattern.map((r) => r.length));
  const grid: Cell[][] = Array.from({ length: ROWS }, () => Array<Cell>(width).fill("."));
  const offset = ROWS - pattern.length;
  pattern.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) grid[y + offset]![x] = row[x] === "#" ? "#" : ".";
  });
  return grid;
}

/**
 * Shadow rule, taken from the wordmark and the opencode wordmark:
 * - counter closed by a baseline bar: shadow in row 3, and row 2 too when
 *   the counter is open above (u, U, 0);
 * - counter open at the bottom between two stems (n, m, h, H): shadow runs
 *   down to the baseline.
 */
function shadowCells(src: Cell[][]): Cell[][] {
  const out = src.map((r) => r.slice());
  const width = src[0]!.length;
  for (let x = 0; x < width; x++) {
    const at = (y: number, dx = 0) => src[y]![x + dx];
    if (at(3) === "." && at(4) === "#") {
      out[3]![x] = "s";
      if (at(2) === "." && at(1) === ".") out[2]![x] = "s";
    } else if (
      x > 0 &&
      x < width - 1 &&
      at(3) === "." &&
      at(4) === "." &&
      at(3, -1) === "#" &&
      at(3, 1) === "#" &&
      (at(2) === "#" || at(1) === "#")
    ) {
      out[3]![x] = "s";
      out[4]![x] = "s";
    }
  }
  return out;
}

/** Punctuation that is not a letter shape gets no derived shadow. */
const NO_SHADOW = new Set([".", "-", "_", ":", "~", '"', "'", "`", "!"]);

/** Bitmap for one character, or undefined when the glyph is missing. */
export function glyph(char: string): Bitmap | undefined {
  const pattern = GLYPHS[char];
  if (!pattern) return undefined;
  const base = pad(pattern);
  return { width: base[0]!.length, cells: NO_SHADOW.has(char) ? base : shadowCells(base) };
}

/** Hollow box shown for characters without a glyph. */
const MISSING: Bitmap = {
  width: 3,
  cells: [
    ["#", "#", "#"],
    ["#", ".", "#"],
    ["#", ".", "#"],
    ["#", ".", "#"],
    ["#", "#", "#"],
  ],
};

export interface Layout {
  width: number;
  ink: Array<[number, number]>;
  shadow: Array<[number, number]>;
  /** Characters that have no glyph. */
  missing: string[];
}

/** Place every cell of `text` on one shared grid. */
export function layout(text: string): Layout {
  const ink: Array<[number, number]> = [];
  const shadow: Array<[number, number]> = [];
  const missing: string[] = [];
  let x0 = 0;
  for (const char of text) {
    if (char === " ") {
      x0 += SPACE;
      continue;
    }
    const bitmap = glyph(char) ?? (missing.push(char), MISSING);
    bitmap.cells.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (cell === "#") ink.push([x0 + x, y]);
        else if (cell === "s") shadow.push([x0 + x, y]);
      }),
    );
    x0 += bitmap.width + TRACKING;
  }
  return { width: Math.max(x0 - TRACKING, 0), ink, shadow, missing };
}

/** Merge horizontal runs of cells into `M x y h w v1 h-w z` path data. */
function path(cells: Array<[number, number]>): string {
  const rows = new Map<number, number[]>();
  for (const [x, y] of cells) rows.set(y, [...(rows.get(y) ?? []), x]);
  let d = "";
  for (const [y, unsorted] of [...rows].toSorted((a, b) => a[0] - b[0])) {
    const xs = unsorted.toSorted((a, b) => a - b);
    let start = xs[0]!;
    let prev = start;
    for (const x of [...xs.slice(1), Infinity]) {
      if (x !== prev + 1) {
        d += `M${start} ${y}h${prev - start + 1}v1h-${prev - start + 1}z`;
        start = x;
      }
      prev = x;
    }
  }
  return d;
}

export interface SvgOptions {
  shadow?: boolean;
  /** Fill color for ink and shadow. */
  color?: string;
  /** Pixel size of one cell. When omitted, the SVG has no fixed size. */
  cell?: number;
  /** Empty cells around the text. */
  margin?: number;
}

/** Standalone SVG for `text`. */
export function toSvg(text: string, options: SvgOptions = {}): string {
  const { shadow = true, color = "currentColor", cell, margin = 0 } = options;
  const l = layout(text);
  const w = Math.max(l.width, 1) + margin * 2;
  const h = ROWS + margin * 2;
  const size = cell ? ` width="${w * cell}" height="${h * cell}"` : "";
  const move = margin ? ` transform="translate(${margin} ${margin})"` : "";
  const shadowPath =
    shadow && l.shadow.length
      ? `<path fill-opacity="${SHADOW_OPACITY}" d="${path(l.shadow)}"/>`
      : "";
  const inkPath = l.ink.length ? `<path d="${path(l.ink)}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"${size} fill="${color}" shape-rendering="crispEdges"><g${move}>${shadowPath}${inkPath}</g></svg>`;
}
