interface SiteConfig {
  url: string;
  title: string;
  description: string;
  author: string;
  social: Record<string, string>;
}

export const site = {
  url: "https://t128n.dev",
  title: "t128n.dev",
  description:
    "Technical Product Owner and Software Engineer in the automotive industry. Building and managing data and software systems, studying Business Informatics at BHT Berlin.",
  author: "Torben Haack",
  social: {
    bluesky: "https://bsky.app/profile/t128n.dev",
    github: "https://github.com/t128n",
  },
} as const satisfies SiteConfig;
