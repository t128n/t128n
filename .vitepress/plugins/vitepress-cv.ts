import type { RenderCvData } from '#docs/cv.data';
import type { Plugin } from 'vite';

import { getRenderCvData } from '#docs/cv.data';
import { execSync } from 'child_process';
import fs from 'fs/promises';
import os from 'os';
import path from 'pathe';

interface Localization {
	summary: string;
	education: string;
	experience: string;
	certifications: string;
	skills: string;
	present: string;
}

const localization: Localization = {
	summary: 'Profile',
	education: 'Education',
	experience: 'Professional Experience',
	certifications: 'Awards & Certifications',
	skills: 'Technical Skills',
	present: 'Present',
};

/**
 * Escape special characters for Typst strings
 */
function escapeTypst(str: string): string {
	return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/**
 * Check if the Typst binary is available in the system
 */
function isTypstAvailable(): boolean {
	try {
		execSync('typst --version', { stdio: 'ignore' });
		return true;
	} catch {
		return false;
	}
}

/**
 * Generate Typst template content for CV
 */
function generateTypstTemplate(data: RenderCvData): string {
	const loc = localization;
	const presentLabel = loc.present;

	// Helper to format dates
	const formatDate = (date: string | undefined): string => {
		if (!date) return presentLabel;
		if (date.toLowerCase() === 'present') return presentLabel;
		return date;
	};

	// Generate education entries
	const educationEntries = data.cv.sections.Education.map(
		(edu) => `#edu(
  institution: "${escapeTypst(edu.institution)}",
  location: "${escapeTypst(edu.location)}",
  dates: dates-helper(start-date: "${escapeTypst(edu.start_date)}", end-date: "${escapeTypst(formatDate(edu.end_date))}"),
  degree: "${escapeTypst(edu.degree ? edu.degree + ', ' + edu.area : edu.area)}",
)`,
	).join('\n\n');

	// Generate experience entries
	const experienceEntries = data.cv.sections.Experience.map((exp) => {
		const highlights = exp.highlights.map((h) => `- ${escapeTypst(h)}`).join('\n');
		const summaryText = exp.summary ? `\n${escapeTypst(exp.summary)}\n` : '';
		return `#work(
  title: "${escapeTypst(exp.position)}",
  location: "${escapeTypst(exp.location)}",
  company: "${escapeTypst(exp.company)}",
  dates: dates-helper(start-date: "${escapeTypst(exp.start_date)}", end-date: "${escapeTypst(formatDate(exp.end_date))}"),
)${summaryText}
${highlights}`;
	}).join('\n\n');

	// Generate certification entries
	const certificationEntries = data.cv.sections['Awards & Certifications']
		.map(
			(cert) => `#certificates(
  name: "${escapeTypst(cert.name)}",
  issuer: "${escapeTypst(cert.location || '')}",
  date: "${escapeTypst(cert.date || '')}",
)`,
		)
		.join('\n\n');

	// Generate skills entries
	const skillsEntries = data.cv.sections['Technical Skills']
		.map((skill) => `- *${escapeTypst(skill.label)}*: ${escapeTypst(skill.details)}`)
		.join('\n');

	// Summary/Profile text
	const summaryText = data.cv.sections.Summary?.[0]?.bullet
		? escapeTypst(data.cv.sections.Summary[0].bullet)
		: '';

	return `#import "@preview/basic-resume:0.2.9": *

#show: resume.with(
  author: "${escapeTypst(data.cv.name)}",
  github: "github.com/t128n",
  linkedin: "linkedin.com/in/torben-haack",
  accent-color: "#6b8e6b",
  font: "New Computer Modern",
  paper: "a4",
  author-position: left,
  personal-info-position: left,
)

== ${loc.summary}

${summaryText}

== ${loc.education}

${educationEntries}

== ${loc.experience}

${experienceEntries}

== ${loc.certifications}

${certificationEntries}

== ${loc.skills}
${skillsEntries}
`;
}

/**
 * Generate PDF from Typst template
 */
async function generatePdf(template: string, outputPath: string): Promise<void> {
	let tempFilePath: string | null = null;

	try {
		// Create temporary file for Typst template
		const tempDir = os.tmpdir();
		tempFilePath = path.join(tempDir, `cv-${Date.now()}.typ`);

		// Write template to temp file
		await fs.writeFile(tempFilePath, template, 'utf-8');

		// Ensure output directory exists
		await fs.mkdir(path.dirname(outputPath), { recursive: true });

		// Compile Typst to PDF
		execSync(`typst compile "${tempFilePath}" "${outputPath}"`, {
			stdio: 'inherit',
		});

		console.log(`✓ Generated PDF: ${outputPath}`);
	} finally {
		if (tempFilePath) {
			try {
				await fs.unlink(tempFilePath);
			} catch (error) {
                console.warn(`Warning: Could not delete temp file ${tempFilePath}`);
				console.warn(error);
			}
		}
	}
}

/**
 * VitePress plugin for CV generation
 */
export function vitepressCv(): Plugin {
	return {
		name: 'vitepress-cv',

		async buildStart() {
			try {
				// Load CV data using the helper function
				const data: RenderCvData = getRenderCvData();

				// Ensure output directory exists
				const outputDir = path.resolve(process.cwd(), 'docs/public');
				await fs.mkdir(outputDir, { recursive: true });

				// Write JSON file in RenderCV format
				const jsonOutputPath = path.join(outputDir, 'cv.json');
				await fs.writeFile(jsonOutputPath, JSON.stringify(data, null, 2), 'utf-8');
				console.log(`✓ Generated CV JSON: ${jsonOutputPath}`);

				// Check if Typst is available
				if (!isTypstAvailable()) {
					console.warn('⚠ Typst binary not found. Skipping PDF generation.');
					console.warn('  Install Typst from: https://github.com/typst/typst');
					return;
				}

				// Generate English PDF using loaded data
				const template = generateTypstTemplate(data);
				const pdfPath = path.join(outputDir, 'cv.pdf');
				await generatePdf(template, pdfPath);

				console.log('✓ CV generation completed successfully');
			} catch (error) {
				console.error('Error generating CV files:', error);
				throw error;
			}
		},
	};
}
