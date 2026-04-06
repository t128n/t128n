import { execSync } from "node:child_process";

export function remarkModifiedTime() {
	return function (tree, file) {
		const filepath = file.history[0];
		if (!filepath) return;

		try {
			// Get the last modified time from git
			if (!file.data.astro.frontmatter.updatedAt) {
				const updatedResult = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`);
				file.data.astro.frontmatter.updatedAt = updatedResult.toString().trim();
			}

			// Get the creation time from git (first commit that added the file)
			if (!file.data.astro.frontmatter.createdAt) {
				const createdResult = execSync(`git log --diff-filter=A --follow --format=%aI -1 -- "${filepath}"`);
				file.data.astro.frontmatter.createdAt = createdResult.toString().trim();
			}
		} catch (e) {
			// If git fails, we just don't set the fields
		}
	};
}
