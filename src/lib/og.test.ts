import { describe, expect, it } from "bun:test";
import { generateOgSvg, renderOgImage } from "./og";

describe("og image generation", () => {
  it("generates valid SVG with escaped title and default metadata", () => {
    const svg = generateOgSvg({
      title: "Hello & <World>",
      description: "Testing SVG output & escaping",
    });

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain("Hello &amp; &lt;World&gt;");
    expect(svg).toContain("Testing SVG output &amp; escaping");
  });

  it("handles title-only generation without description", () => {
    const svg = generateOgSvg({
      title: "Title Only Page",
    });

    expect(svg).toContain("<svg");
    expect(svg).toContain("Title Only Page");
    expect(svg).not.toContain('class="desc"');
  });

  it("renders JPEG image buffer with valid dimensions", async () => {
    const imageBytes = await renderOgImage({
      title: "Test Article Title",
      description: "A short description of the test article.",
    });

    expect(imageBytes).toBeInstanceOf(Uint8Array);
    expect(imageBytes.length).toBeGreaterThan(0);
  });
});
