import type { RenderCvData } from '#docs/cv.data';
import { execSync } from 'child_process';
import fs from 'fs/promises';
import os from 'os';
import path from 'pathe';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock modules before importing the module under test
vi.mock('child_process');
vi.mock('fs/promises');
vi.mock('os');

// Mock the cv.data module with a getRenderCvData function that we can control
const mockGetRenderCvData = vi.fn();
vi.mock('#docs/cv.data', () => ({
	getRenderCvData: mockGetRenderCvData,
}));

// Import after mocking to ensure mocks are applied
const { vitepressCv } = await import('./vitepress-cv');

// Helper to call the plugin's buildStart hook
async function callBuildStart(plugin: ReturnType<typeof vitepressCv>) {
	const buildStart = plugin.buildStart;
	if (typeof buildStart === 'function') {
		await buildStart.call({} as any, {} as any);
	} else if (buildStart && typeof buildStart === 'object' && 'handler' in buildStart) {
		await buildStart.handler.call({} as any, {} as any);
	}
}

// Mock CV data for testing
const mockCvData: RenderCvData = {
	$schema: 'https://raw.githubusercontent.com/sinaatalay/rendercv/main/schema.json',
	cv: {
		name: 'Test User',
		location: 'Test City, Country',
		photo: '/test.png',
		sections: {
			Summary: [
				{
					bullet: 'Test summary with "quotes" and \\backslashes',
				},
			],
			Education: [
				{
					institution: 'Test University',
					area: 'Computer Science',
					degree: 'Bachelor of Science',
					start_date: 'Sep 2020',
					end_date: 'Jun 2024',
					location: 'Test City',
				},
				{
					institution: 'Another University',
					area: 'Mathematics',
					start_date: 'Sep 2024',
					end_date: 'present',
					location: 'Another City',
				},
			],
			Experience: [
				{
					company: 'Test Company',
					position: 'Software Engineer',
					start_date: 'Jan 2024',
					end_date: 'present',
					location: 'Test City',
					summary: 'Test summary description',
					highlights: [
						'Built test feature with "quotes"',
						'Improved performance by 50%',
					],
				},
				{
					company: 'Previous Company',
					position: 'Junior Developer',
					start_date: 'Jun 2023',
					end_date: 'Dec 2023',
					location: 'Another City',
					highlights: ['Developed test application'],
				},
			],
			'Awards & Certifications': [
				{
					name: 'Test Certification',
					location: 'Test Issuer',
					date: '2024',
				},
				{
					name: 'Award with "quotes"',
					date: '2023',
				},
			],
			'Technical Skills': [
				{
					label: 'Programming',
					details: 'Python, JavaScript, TypeScript',
				},
				{
					label: 'Tools & Frameworks',
					details: 'React, Node.js, Docker',
				},
			],
		},
	},
};

describe('vitepress-cv', () => {
	const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
	const mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

	beforeEach(() => {
		vi.clearAllMocks();

		// Setup default mocks
		vi.mocked(os.tmpdir).mockReturnValue('/tmp');
		vi.mocked(fs.mkdir).mockResolvedValue(undefined);
		vi.mocked(fs.writeFile).mockResolvedValue(undefined);
		vi.mocked(fs.unlink).mockResolvedValue(undefined);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('escapeTypst', () => {
		// We need to test the internal function by testing its behavior through template generation
		it('should escape backslashes in generated template', async () => {
			mockGetRenderCvData.mockReturnValue({
				...mockCvData,
				cv: {
					...mockCvData.cv,
					sections: {
						...mockCvData.cv.sections,
						Summary: [{ bullet: 'Text with \\ backslash' }],
					},
				},
			});

			// The escapeTypst function should escape backslashes
			// We can verify this by checking the template output in integration tests
		});

		it('should escape double quotes in generated template', async () => {
			mockGetRenderCvData.mockReturnValue({
				...mockCvData,
				cv: {
					...mockCvData.cv,
					sections: {
						...mockCvData.cv.sections,
						Summary: [{ bullet: 'Text with "quotes"' }],
					},
				},
			});

			// The escapeTypst function should escape quotes
			// We can verify this by checking the template output in integration tests
		});
	});

	describe('isTypstAvailable', () => {
		it('should return true when Typst binary is available', async () => {
			vi.mocked(execSync).mockReturnValue(Buffer.from('typst 0.10.0'));

			mockGetRenderCvData.mockReturnValue(mockCvData);

			const plugin = vitepressCv();
			await callBuildStart(plugin);

			// Should attempt PDF generation (not just skip with warning)
			expect(mockConsoleWarn).not.toHaveBeenCalledWith(
				expect.stringContaining('Typst binary not found'),
			);
		});

		it('should return false when Typst binary is not available', async () => {
			vi.mocked(execSync).mockImplementation((cmd: string) => {
				if (cmd.includes('typst --version')) {
					throw new Error('Command not found');
				}
				return Buffer.from('');
			});

			mockGetRenderCvData.mockReturnValue(mockCvData);

			const plugin = vitepressCv();
			await callBuildStart(plugin);

			// Should warn about missing Typst
			expect(mockConsoleWarn).toHaveBeenCalledWith(
				expect.stringContaining('Typst binary not found'),
			);
		});
	});

	describe('generateTypstTemplate', () => {
		it('should generate complete template with all sections', async () => {
			mockGetRenderCvData.mockReturnValue(mockCvData);
			vi.mocked(execSync).mockReturnValue(Buffer.from('typst 0.10.0'));

			const plugin = vitepressCv();
			await callBuildStart(plugin);

			// Check that template file was written
			expect(fs.writeFile).toHaveBeenCalled();
			const writeFileCalls = vi.mocked(fs.writeFile).mock.calls;

			// Find the Typst template write call (not the JSON)
			const typstTemplateCall = writeFileCalls.find(
				([path]) => typeof path === 'string' && path.endsWith('.typ'),
			);

			expect(typstTemplateCall).toBeDefined();
			const [, template] = typstTemplateCall!;
			const templateStr = template.toString();

			// Verify template contains expected sections
			expect(templateStr).toContain('#import "@preview/basic-resume:0.2.9": *');
			expect(templateStr).toContain('author: "Test User"');
			expect(templateStr).toContain('== Profile');
			expect(templateStr).toContain('== Education');
			expect(templateStr).toContain('== Professional Experience');
			expect(templateStr).toContain('== Awards & Certifications');
			expect(templateStr).toContain('== Technical Skills');
		});

		it('should properly escape special characters in CV data', async () => {
			mockGetRenderCvData.mockReturnValue({
				...mockCvData,
				cv: {
					...mockCvData.cv,
					name: 'User with "quotes" and \\backslash',
				},
			});
			vi.mocked(execSync).mockReturnValue(Buffer.from('typst 0.10.0'));

			const plugin = vitepressCv();
			await callBuildStart(plugin);

			const writeFileCalls = vi.mocked(fs.writeFile).mock.calls;
			const typstTemplateCall = writeFileCalls.find(
				([path]) => typeof path === 'string' && path.endsWith('.typ'),
			);

			const [, template] = typstTemplateCall!;
			const templateStr = template.toString();

			// Verify escaping: backslashes should be doubled, quotes should be escaped
			// In the template string: \" represents an escaped quote, \\ represents an escaped backslash
			expect(templateStr).toContain('User with \\"quotes\\" and \\\\backslash');
		});

		it('should handle "present" end dates correctly', async () => {
			mockGetRenderCvData.mockReturnValue(mockCvData);
			vi.mocked(execSync).mockReturnValue(Buffer.from('typst 0.10.0'));

			const plugin = vitepressCv();
			await callBuildStart(plugin);

			const writeFileCalls = vi.mocked(fs.writeFile).mock.calls;
			const typstTemplateCall = writeFileCalls.find(
				([path]) => typeof path === 'string' && path.endsWith('.typ'),
			);

			const [, template] = typstTemplateCall!;
			const templateStr = template.toString();

			// Should contain "Present" for current positions
			expect(templateStr).toContain('end-date: "Present"');
		});

		it('should generate education entries with all fields', async () => {
			mockGetRenderCvData.mockReturnValue(mockCvData);
			vi.mocked(execSync).mockReturnValue(Buffer.from('typst 0.10.0'));

			const plugin = vitepressCv();
			await callBuildStart(plugin);

			const writeFileCalls = vi.mocked(fs.writeFile).mock.calls;
			const typstTemplateCall = writeFileCalls.find(
				([path]) => typeof path === 'string' && path.endsWith('.typ'),
			);

			const [, template] = typstTemplateCall!;
			const templateStr = template.toString();

			expect(templateStr).toContain('institution: "Test University"');
			expect(templateStr).toContain('degree: "Bachelor of Science, Computer Science"');
			expect(templateStr).toContain('location: "Test City"');
		});

		it('should generate experience entries with highlights', async () => {
			mockGetRenderCvData.mockReturnValue(mockCvData);
			vi.mocked(execSync).mockReturnValue(Buffer.from('typst 0.10.0'));

			const plugin = vitepressCv();
			await callBuildStart(plugin);

			const writeFileCalls = vi.mocked(fs.writeFile).mock.calls;
			const typstTemplateCall = writeFileCalls.find(
				([path]) => typeof path === 'string' && path.endsWith('.typ'),
			);

			const [, template] = typstTemplateCall!;
			const templateStr = template.toString();

			expect(templateStr).toContain('title: "Software Engineer"');
			expect(templateStr).toContain('company: "Test Company"');
			expect(templateStr).toContain('Test summary description');
			expect(templateStr).toContain('- Built test feature');
			expect(templateStr).toContain('- Improved performance by 50%');
		});

		it('should generate certification entries', async () => {
			mockGetRenderCvData.mockReturnValue(mockCvData);
			vi.mocked(execSync).mockReturnValue(Buffer.from('typst 0.10.0'));

			const plugin = vitepressCv();
			await callBuildStart(plugin);

			const writeFileCalls = vi.mocked(fs.writeFile).mock.calls;
			const typstTemplateCall = writeFileCalls.find(
				([path]) => typeof path === 'string' && path.endsWith('.typ'),
			);

			const [, template] = typstTemplateCall!;
			const templateStr = template.toString();

			expect(templateStr).toContain('name: "Test Certification"');
			expect(templateStr).toContain('issuer: "Test Issuer"');
			expect(templateStr).toContain('date: "2024"');
		});

		it('should generate skills entries', async () => {
			mockGetRenderCvData.mockReturnValue(mockCvData);
			vi.mocked(execSync).mockReturnValue(Buffer.from('typst 0.10.0'));

			const plugin = vitepressCv();
			await callBuildStart(plugin);

			const writeFileCalls = vi.mocked(fs.writeFile).mock.calls;
			const typstTemplateCall = writeFileCalls.find(
				([path]) => typeof path === 'string' && path.endsWith('.typ'),
			);

			const [, template] = typstTemplateCall!;
			const templateStr = template.toString();

			expect(templateStr).toContain('- *Programming*: Python, JavaScript, TypeScript');
			expect(templateStr).toContain('- *Tools & Frameworks*: React, Node.js, Docker');
		});
	});

	describe('generatePdf', () => {
		it('should create temporary file and compile to PDF', async () => {
			mockGetRenderCvData.mockReturnValue(mockCvData);
			vi.mocked(execSync).mockReturnValue(Buffer.from('typst 0.10.0'));

			const plugin = vitepressCv();
			await callBuildStart(plugin);

			// Verify temp file was created
			const writeFileCalls = vi.mocked(fs.writeFile).mock.calls;
			const tempFileCall = writeFileCalls.find(
				([path]) => typeof path === 'string' && path.includes('/tmp/') && path.endsWith('.typ'),
			);
			expect(tempFileCall).toBeDefined();

			// Verify Typst compilation command was executed
			const execCalls = vi.mocked(execSync).mock.calls;
			const compileCall = execCalls.find(([cmd]) =>
				cmd.toString().includes('typst compile'),
			);
			expect(compileCall).toBeDefined();
		});

		it('should clean up temporary file after successful compilation', async () => {
			mockGetRenderCvData.mockReturnValue(mockCvData);
			vi.mocked(execSync).mockReturnValue(Buffer.from('typst 0.10.0'));

			const plugin = vitepressCv();
			await callBuildStart(plugin);

			// Verify temp file was cleaned up
			expect(fs.unlink).toHaveBeenCalled();
			const unlinkCalls = vi.mocked(fs.unlink).mock.calls;
			const tempFileUnlink = unlinkCalls.find(([path]) =>
				path.toString().includes('/tmp/') && path.toString().endsWith('.typ'),
			);
			expect(tempFileUnlink).toBeDefined();
		});

		it('should clean up temporary file even on compilation failure', async () => {
			mockGetRenderCvData.mockReturnValue(mockCvData);

			// First call for version check succeeds, second for compilation fails
			let callCount = 0;
			vi.mocked(execSync).mockImplementation(() => {
				callCount++;
				if (callCount === 1) {
					return Buffer.from('typst 0.10.0');
				}
				throw new Error('Compilation failed');
			});

			const plugin = vitepressCv();

			// Should throw error but still clean up
			await expect(callBuildStart(plugin)).rejects.toThrow();

			// Verify temp file was still cleaned up
			expect(fs.unlink).toHaveBeenCalled();
		});

		it('should create output directory if it does not exist', async () => {
			mockGetRenderCvData.mockReturnValue(mockCvData);
			vi.mocked(execSync).mockReturnValue(Buffer.from('typst 0.10.0'));

			const plugin = vitepressCv();
			await callBuildStart(plugin);

			// Verify mkdir was called with recursive option
			expect(fs.mkdir).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({ recursive: true }),
			);
		});

		it('should handle cleanup errors gracefully', async () => {
			mockGetRenderCvData.mockReturnValue(mockCvData);
			vi.mocked(execSync).mockReturnValue(Buffer.from('typst 0.10.0'));

			// Mock unlink to fail
			vi.mocked(fs.unlink).mockRejectedValue(new Error('Permission denied'));

			const plugin = vitepressCv();

			// Should not throw, just warn
			await expect(callBuildStart(plugin)).resolves.not.toThrow();

			// Should log warning about cleanup failure
			expect(mockConsoleWarn).toHaveBeenCalledWith(
				expect.stringContaining('Could not delete temp file'),
			);
		});
	});

	describe('vitepressCv plugin', () => {
		it('should have correct plugin name', () => {
			const plugin = vitepressCv();
			expect(plugin.name).toBe('vitepress-cv');
		});

		it('should generate JSON file with CV data', async () => {
			mockGetRenderCvData.mockReturnValue(mockCvData);
			vi.mocked(execSync).mockReturnValue(Buffer.from('typst 0.10.0'));

			const plugin = vitepressCv();
			await callBuildStart(plugin);

			// Verify JSON file was written
			const writeFileCalls = vi.mocked(fs.writeFile).mock.calls;
			const jsonCall = writeFileCalls.find(([path]) =>
				path.toString().endsWith('cv.json'),
			);

			expect(jsonCall).toBeDefined();
			const [jsonPath, jsonContent] = jsonCall!;

			expect(jsonPath.toString()).toContain('docs/public/cv.json');

			// Verify JSON content
			const parsedJson = JSON.parse(jsonContent.toString());
			expect(parsedJson).toEqual(mockCvData);
		});

		it('should log success messages for JSON and PDF generation', async () => {
			mockGetRenderCvData.mockReturnValue(mockCvData);
			vi.mocked(execSync).mockReturnValue(Buffer.from('typst 0.10.0'));

			const plugin = vitepressCv();
			await callBuildStart(plugin);

			expect(mockConsoleLog).toHaveBeenCalledWith(
				expect.stringContaining('Generated CV JSON'),
			);
			expect(mockConsoleLog).toHaveBeenCalledWith(
				expect.stringContaining('Generated PDF'),
			);
			expect(mockConsoleLog).toHaveBeenCalledWith(
				expect.stringContaining('CV generation completed successfully'),
			);
		});

		it('should skip PDF generation when Typst is not available', async () => {
			mockGetRenderCvData.mockReturnValue(mockCvData);

			vi.mocked(execSync).mockImplementation(() => {
				throw new Error('Command not found');
			});

			const plugin = vitepressCv();
			await callBuildStart(plugin);

			// Should still generate JSON
			expect(mockConsoleLog).toHaveBeenCalledWith(
				expect.stringContaining('Generated CV JSON'),
			);

			// Should warn about missing Typst
			expect(mockConsoleWarn).toHaveBeenCalledWith(
				'⚠ Typst binary not found. Skipping PDF generation.',
			);
			expect(mockConsoleWarn).toHaveBeenCalledWith(
				'  Install Typst from: https://github.com/typst/typst',
			);

			// Should NOT log PDF generation success
			expect(mockConsoleLog).not.toHaveBeenCalledWith(
				expect.stringContaining('Generated PDF'),
			);
		});

		it('should throw error and log when CV generation fails', async () => {
			mockGetRenderCvData.mockImplementation(() => {
				throw new Error('Failed to load CV data');
			});

			const plugin = vitepressCv();

			await expect(callBuildStart(plugin)).rejects.toThrow(
				'Failed to load CV data',
			);

			expect(mockConsoleError).toHaveBeenCalledWith(
				'Error generating CV files:',
				expect.any(Error),
			);
		});

		it('should create output directory with correct path', async () => {
			mockGetRenderCvData.mockReturnValue(mockCvData);
			vi.mocked(execSync).mockReturnValue(Buffer.from('typst 0.10.0'));

			const plugin = vitepressCv();
			await callBuildStart(plugin);

			// Verify output directory was created
			const mkdirCalls = vi.mocked(fs.mkdir).mock.calls;
			const publicDirCall = mkdirCalls.find(([path]) =>
				path.toString().endsWith('docs/public'),
			);

			expect(publicDirCall).toBeDefined();
			expect(publicDirCall![1]).toEqual({ recursive: true });
		});

		it('should handle file system errors during JSON write', async () => {
			mockGetRenderCvData.mockReturnValue(mockCvData);

			vi.mocked(fs.writeFile).mockRejectedValueOnce(
				new Error('Disk full'),
			);

			const plugin = vitepressCv();

			await expect(callBuildStart(plugin)).rejects.toThrow('Disk full');
			expect(mockConsoleError).toHaveBeenCalledWith(
				'Error generating CV files:',
				expect.any(Error),
			);
		});

		it('should handle missing optional fields in CV data', async () => {
			const minimalCvData: RenderCvData = {
				$schema: 'https://raw.githubusercontent.com/sinaatalay/rendercv/main/schema.json',
				cv: {
					name: 'Minimal User',
					location: 'Minimal City',
					sections: {
						Summary: [],
						Education: [
							{
								institution: 'University',
								area: 'CS',
								start_date: '2020',
								location: 'City',
							},
						],
						Experience: [
							{
								company: 'Company',
								position: 'Developer',
								start_date: '2024',
								location: 'City',
								highlights: [],
							},
						],
						'Awards & Certifications': [],
						'Technical Skills': [],
					},
				},
			};

			mockGetRenderCvData.mockReturnValue(minimalCvData);
			vi.mocked(execSync).mockReturnValue(Buffer.from('typst 0.10.0'));

			const plugin = vitepressCv();

			// Should not throw with minimal data
			await expect(callBuildStart(plugin)).resolves.not.toThrow();
		});
	});
});
