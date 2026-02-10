#!/usr/bin/env tsx
/**
 * CV Typst Generator
 *
 * Generates a Typst (.typ) file from cv.data.ts
 * Run with: tsx scripts/generate-cv-typst.ts
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { CVData } from '../docs/cv/cv.data';

// Import the CV data
async function loadCVData(): Promise<CVData> {
	const module = await import('../docs/cv/cv.data.js');
	return module.default.load();
}

// Date formatting helper
function formatDate(dateStr: string | null): string {
	if (!dateStr) return '';
	const [year, month] = dateStr.split('-');
	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];
	return `${months[parseInt(month) - 1]} ${year}`;
}

function formatDateRange(start: string, end: string | null): string {
	const startFormatted = formatDate(start);
	const endFormatted = end ? formatDate(end) : '';
	return endFormatted
		? `start-date: "${startFormatted}", end-date: "${endFormatted}"`
		: `start-date: "${startFormatted}", end-date: ""`;
}

// Get profile URL by network
function getProfileUrl(data: CVData, network: string): string {
	const profile = data.basics.profiles.find((p) => p.network === network);
	return profile?.url || '';
}

// Anonymize company names
function anonymizeCompany(name: string): string {
	const anonymizationMap: Record<string, string> = {
		'Mercedes-Benz AG': 'Automotive OEM',
	};
	return anonymizationMap[name] || name;
}

// Generate sections
function generateEducationSection(data: CVData): string {
	return data.education
		.map(
			(edu) => `
#edu(
  institution: "${edu.institution}",
  location: "${edu.location}",
  dates: dates-helper(${formatDateRange(edu.startDate, edu.endDate)}),
  degree: "${edu.studyType}${edu.area ? ', ' + edu.area : ''}",
)${edu.notes ? `\n_${edu.notes}_\n` : ''}
`,
		)
		.join('\n');
}

function generateWorkSection(data: CVData): string {
	return data.work
		.map(
			(job) => `
#work(
  title: "${job.position}",
  location: "${job.location}",
  company: "${anonymizeCompany(job.name)}",
  dates: dates-helper(${formatDateRange(job.startDate, job.endDate)}),
)
${job.summary}

${job.highlights.map((h) => `- ${h}`).join('\n')}
`,
		)
		.join('\n');
}

function generateAwardsSection(data: CVData): string {
	if (data.awards.length === 0) return '';
	return data.awards
		.map(
			(award) => `
#certificates(
  name: "${award.title}",
  issuer: "${award.issuer}",
  date: "${award.date}",
)
`,
		)
		.join('\n');
}

function generateCertificatesSection(data: CVData): string {
	if (data.certificates.length === 0) return '';
	return data.certificates
		.map(
			(cert) => `
#certificates(
  name: "${cert.name}",
  issuer: "${cert.issuer}",
  date: "${cert.date}",
)
`,
		)
		.join('\n');
}

function generateSkillsSection(data: CVData): string {
	return data.skills
		.map((skill) => {
			const level = skill.level ? ` (${skill.level})` : '';
			return `- *${skill.name}*${level}: ${skill.keywords.join(', ')}`;
		})
		.join('\n');
}

function generateLanguagesSection(data: CVData): string {
	return data.languages.map((lang) => `- ${lang.language} – ${lang.fluency}`).join('\n');
}

// Main generator function
async function generateTypstCV() {
	console.log('Loading CV data...');
	const data = await loadCVData();

	console.log('Reading template...');
	const templatePath = join(process.cwd(), 'docs/cv/cv.typ.template');
	let template = readFileSync(templatePath, 'utf-8');

	console.log('Generating sections...');

	// Replace template variables
	const replacements: Record<string, string> = {
		'{{ basics.name }}': data.basics.name,
		'{{ basics.location.city }}': data.basics.location.city,
		'{{ basics.location.country }}': data.basics.location.country,
		'{{ basics.email }}': data.basics.email,
		'{{ basics.phone }}': data.basics.phone,
		'{{ github_url }}': getProfileUrl(data, 'GitHub'),
		'{{ linkedin_url }}': getProfileUrl(data, 'LinkedIn'),
		'{{ basics.summary }}': data.basics.summary,
		'{{ education_section }}': generateEducationSection(data),
		'{{ work_section }}': generateWorkSection(data),
		'{{ awards_section }}': generateAwardsSection(data),
		'{{ certificates_section }}': generateCertificatesSection(data),
		'{{ skills_section }}': generateSkillsSection(data),
		'{{ languages_section }}': generateLanguagesSection(data),
	};

	for (const [placeholder, value] of Object.entries(replacements)) {
		template = template.replace(placeholder, value);
	}

	console.log('Writing cv.typ...');
	const outputPath = join(process.cwd(), 'docs/cv/cv.typ');
	writeFileSync(outputPath, template, 'utf-8');

	console.log('✓ Generated cv.typ successfully!');
	console.log(`  Output: ${outputPath}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	generateTypstCV().catch((error) => {
		console.error('Error generating Typst CV:', error);
		process.exit(1);
	});
}

export { generateTypstCV };
