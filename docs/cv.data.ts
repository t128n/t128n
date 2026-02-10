// RenderCV-compatible CV data structure
// Schema: https://raw.githubusercontent.com/sinaatalay/rendercv/main/schema.json

export interface RenderCvEducation {
	institution: string;
	area: string;
	degree?: string;
	start_date: string;
	end_date?: string;
	location: string;
}

export interface RenderCvExperience {
	company: string;
	position: string;
	start_date: string;
	end_date?: string;
	location: string;
	summary?: string;
	highlights: string[];
}

export interface RenderCvOneLineEntry {
	label: string;
	details: string;
}

export interface RenderCvNormalEntry {
	name: string;
	date?: string;
	location?: string;
}

export interface RenderCvBulletEntry {
	bullet: string;
}

export interface RenderCvData {
	$schema: string;
	cv: {
		name: string;
		location: string;
		photo?: string;
		sections: {
			Summary: RenderCvBulletEntry[];
			Education: RenderCvEducation[];
			Experience: RenderCvExperience[];
			'Awards & Certifications': RenderCvNormalEntry[];
			'Technical Skills': RenderCvOneLineEntry[];
		};
	};
}

// Export the raw CV data that will be used by both the template and plugin
export const cvData: RenderCvData['cv'] = {
	name: 'Torben Haack',
	location: 'Berlin, Germany',
	photo: '/t128n.png',
	sections: {
		Summary: [
			{
				bullet:
					'Technical Product Owner for IIoT data products in automotive manufacturing. Bridging IT/OT systems while building full-stack applications, data pipelines, and integration solutions.',
			},
		],
		Education: [
			{
				institution: 'Berliner Hochschule für Technik (BHT)',
				area: 'Business Informatics',
				degree: 'Bachelor of Science',
				start_date: 'Oct 2025',
				end_date: 'present',
				location: 'Berlin, Germany',
			},
			{
				institution: 'OSZ IMT',
				area: 'Data and Process Analysis',
				degree: 'IT Specialist',
				start_date: 'Sep 2022',
				end_date: 'Jan 2025',
				location: 'Berlin, Germany',
			},
		],
		Experience: [
			{
				position: 'Technical Product Owner',
				company: 'Automotive OEM',
				start_date: 'Nov 2025',
				end_date: 'present',
				location: 'Berlin, Germany',
				summary:
					'Transitioned from hands-on engineering to product ownership while maintaining technical depth.',
				highlights: [
					'Own multiple OT data products end-to-end—from requirements through deployment—serving hundreds of users and processing hundreds of GB daily with near-realtime actuality.',
					'Organize and facilitate IIoT steering committee, coordinating cross-departmental communication and knowledge sharing across the company.',
					'Own IT/OT infrastructure services and cross-boundary integration solutions, bridging operational and information technology systems.',
					'Design and build full-stack web applications and monitoring solutions, reducing manual work and increasing observability.',
					'Develop data pipelines and product specifications in collaboration with manufacturing and operations stakeholders.',
				],
			},
			{
				position: 'Software Engineer',
				company: 'Automotive OEM',
				start_date: 'Jan 2025',
				end_date: 'Nov 2025',
				location: 'Berlin, Germany',
				highlights: [
					'Designed and built automated testing solution for Windows OT images using Node.js, improving compliance and deployment reliability.',
					'Owned end-to-end delivery of OT data products including specification, development, deployment, and customer support.',
					'Built internal full-stack web application serving dozens of manufacturing operations users.',
					'Developed monitoring dashboards and automation tools, standardizing workflows.',
					'Maintained and hardened Windows OT images including lifecycle management.',
				],
			},
			{
				position: 'Apprentice — IT Specialist for Data and Process Analysis',
				company: 'Automotive OEM',
				start_date: 'Sep 2022',
				end_date: 'Jan 2025',
				location: 'Berlin, Germany',
				highlights: [
					'Completed apprenticeship 6 months ahead of schedule, earning top marks in Berlin.',
					'Developed Python monitoring dashboard for manufacturing quality processes, increasing operational observability.',
					'Built local-first web application for automated analysis of business domain data.',
					'Mentored new apprentices and delivered technical webinars on Git, GitHub, and engineering standards to employees transitioning from manufacturing to IT.',
				],
			},
		],
		'Awards & Certifications': [
			{
				name: 'Top in State: IT Specialist for Data and Process Analysis',
				location: 'IHK Berlin',
				date: '2025',
			},
			{
				name: 'GitHub Foundations',
				location: 'GitHub',
				date: '2024',
			},
		],
		'Technical Skills': [
			{
				label: 'Programming',
				details: 'Python, Node.js, TypeScript, Bash, SQL, React, Next.js, Vue, Nuxt, REST APIs',
			},
			{
				label: 'Infrastructure & DevOps',
				details: 'Docker, Podman, CI/CD, Git, Linux, Infrastructure as Code',
			},
			{
				label: 'Data & IIoT',
				details:
					'Data Products, ETL Pipelines, Data Quality, IIoT Systems, Test Automation',
			},
			{
				label: 'Product & Process',
				details:
					'Stakeholder Management, Roadmap Ownership, Cross-team Coordination, Requirements Engineering',
			},
			{
				label: 'Languages',
				details: 'German (Native), English (Professional Proficiency)',
			},
		],
	},
};

export default {
	load(): RenderCvData['cv'] {
		return cvData;
	},
};

export function getRenderCvData(): RenderCvData {
	return {
		$schema: 'https://raw.githubusercontent.com/sinaatalay/rendercv/main/schema.json',
		cv: cvData,
	};
}
