import { describe, expect, it } from "bun:test";
import { layout, toSvg } from "./glyphs";

type Rect = [x: number, y: number, w: number, h: number];

function cellsOf(rects: Rect[]): Set<string> {
  const out = new Set<string>();
  for (const [x, y, w, h] of rects)
    for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) out.add(`${x + i},${y + j}`);
  return out;
}

const key = (cells: Array<[number, number]>) => new Set(cells.map(([x, y]) => `${x},${y}`));

describe("glyphs", () => {
  // Cells copied from src/components/wordmark.astro.
  it("reproduces the t128n wordmark", () => {
    const l = layout("t128n");
    expect(l.width).toBe(18);
    expect(l.missing).toEqual([]);
    expect(key(l.ink)).toEqual(
      cellsOf([
        [0, 0, 1, 5],
        [0, 1, 3, 1],
        [0, 4, 3, 1],
        [4, 0, 1, 1],
        [5, 0, 1, 5],
        [7, 0, 3, 1],
        [9, 1, 1, 1],
        [7, 2, 3, 1],
        [7, 3, 1, 1],
        [7, 4, 3, 1],
        [11, 0, 3, 1],
        [11, 2, 3, 1],
        [11, 4, 3, 1],
        [11, 0, 1, 5],
        [13, 0, 1, 5],
        [15, 1, 3, 1],
        [15, 1, 1, 4],
        [17, 1, 1, 4],
      ]),
    );
    expect(key(l.shadow)).toEqual(
      cellsOf([
        [1, 3, 2, 1],
        [8, 3, 2, 1],
        [12, 3, 1, 1],
        [16, 3, 1, 2],
      ]),
    );
  });

  it("never lets a shadow cell overlap ink", () => {
    const l = layout("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
    const ink = key(l.ink);
    expect(l.shadow.filter(([x, y]) => ink.has(`${x},${y}`))).toEqual([]);
  });

  it("marks characters without a glyph", () => {
    expect(layout("a€b").missing).toEqual(["€"]);
  });

  it("renders a standalone svg", () => {
    const svg = toSvg("t", { color: "#fff", cell: 10 });
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('width="30" height="50"');
    expect(svg).toContain('fill="#fff"');
  });

  it("omits shadows when asked", () => {
    expect(toSvg("t", { shadow: false })).not.toContain("fill-opacity");
  });
});
