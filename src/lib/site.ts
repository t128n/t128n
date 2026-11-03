interface SiteConfig {
  url: string;
  title: string;
  description: string;
  author: string;
  social: Record<"bluesky" | "github" | "email", string>;
  blog: {
    title: string;
    description: string;
  };
}

export const site = {
  url: "https://t128n.dev",
  title: "t128n.dev",
  description:
    "Technical Product Owner and Software Engineer in the automotive industry. Building and managing data and software systems, defining technical standards, studying Business Informatics at BHT Berlin.",
  author: "Torben Haack",
  social: {
    bluesky: "https://bsky.app/profile/t128n.dev",
    github: "https://github.com/t128n",
    email: "mailto:t128n@ipv4.8shield.net",
  },
  blog: {
    title: "Blog",
    description: "Occasional notes on software, data, and the systems around them.",
  },
} as const satisfies SiteConfig;
