import { createHash } from "node:crypto";

/**
 * Generate a URL-friendly slug from a title and publish date.
 * @param title The title to slugify.
 * @param publishDate The publish date to include in the slug.
 * @returns A slugified string with a unique hash suffix.
 */
export function generateSlug(title: string, publishDate: Date): string {
	const slugified = title
		.toLowerCase()
		.trim()
		.replace(/[.]/g, "-") // Dots to hyphens
		.replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric, non-space, non-hyphen
		.replace(/\s+/g, "-") // Spaces to hyphens
		.replace(/--+/g, "-") // Collapse multiple hyphens
		.replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens

	// Create a deterministic hash based on title + publishDate (for uniqueness)
	const hashInput = `${title}-${publishDate.toISOString()}`;
	const hash = createHash("sha256").update(hashInput).digest("hex").slice(0, 5); // 5-char hex (e.g., 'r9fs3')

	return `${slugified}-${hash}`;
}
