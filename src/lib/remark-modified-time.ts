import { execSync } from "node:child_process";

import type { Root } from "mdast";
import type { VFile } from "vfile";

export function remarkModifiedTime() {
	return function (_tree: Root, file: VFile) {
		const filepath = file.history[0];
		if (!filepath) return;

		try {
			// Get the last modified time from git
			if (!file.data.astro?.frontmatter?.updatedAt) {
				const updatedResult = execSync(
					`git log -1 --pretty="format:%cI" "${filepath}"`,
				);
				const updatedAt = updatedResult.toString().trim();
				if (updatedAt) {
					file.data.astro = file.data.astro || { frontmatter: {} };
					file.data.astro.frontmatter =
						file.data.astro.frontmatter || {};
					file.data.astro.frontmatter.updatedAt = updatedAt;
				}
			}

			// Get the creation time from git (first commit that added the file)
			if (!file.data.astro?.frontmatter?.createdAt) {
				const createdResult = execSync(
					`git log --diff-filter=A --follow --format=%aI -1 -- "${filepath}"`,
				);
				const createdAt = createdResult.toString().trim();
				if (createdAt) {
					file.data.astro = file.data.astro || { frontmatter: {} };
					file.data.astro.frontmatter =
						file.data.astro.frontmatter || {};
					file.data.astro.frontmatter.createdAt = createdAt;
				}
			}
		} catch {
			// If git fails, we just don't set the fields
		}
	};
}
