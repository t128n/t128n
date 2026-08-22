import { Resvg } from "@resvg/resvg-js";
import { Liquid } from "liquidjs";
import { site } from "@/lib/site";
import ogSvgTemplate from "@/assets/og.svg?raw";

const liquid = new Liquid();

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

function wrapText(text: string, maxCharsPerLine: number, maxLines = 3): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
    } else if ((currentLine + " " + word).length <= maxCharsPerLine) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
      if (lines.length >= maxLines) {
        break;
      }
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  if (lines.length === maxLines) {
    const totalWords = lines.join(" ").split(" ").length;
    if (totalWords < words.length) {
      lines[maxLines - 1] = lines[maxLines - 1].replace(/\.*$/, "") + "…";
    }
  }

  return lines;
}

export function generateOgSvg({
  title,
  description,
  siteName = site.title,
  author = site.author,
}: {
  title: string;
  description?: string;
  siteName?: string;
  author?: string;
}): string {
  const titleLines = wrapText(title, 30, 3);
  const descLines = description ? wrapText(description, 54, 4) : [];

  const titleStartY = 200;
  const titleLineHeight = 60;
  const titleEndY = titleStartY + (titleLines.length - 1) * titleLineHeight;

  const descStartY = titleEndY + 52;
  const descLineHeight = 42;

  const titleTspans = titleLines
    .map(
      (line, i) =>
        `<tspan x="100" y="${titleStartY + i * titleLineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join("\n    ");

  const descTspans = descLines
    .map(
      (line, i) =>
        `<tspan x="140" y="${descStartY + i * descLineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join("\n    ");

  const descriptionBlock =
    descLines.length > 0 ? `<text class="desc">\n    ${descTspans}\n  </text>` : "";

  return liquid.parseAndRenderSync(ogSvgTemplate, {
    site_name: escapeXml(siteName),
    author: escapeXml(author),
    title_tspans: titleTspans,
    description_block: descriptionBlock,
  });
}

export async function renderOgImage({
  title,
  description,
}: {
  title: string;
  description?: string;
}): Promise<Uint8Array> {
  const svg = generateOgSvg({ title, description });
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return await new Bun.Image(pngBuffer).jpeg({ quality: 85 }).bytes();
}
