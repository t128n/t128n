import verify from "~/content/data/verify.json";

export function useVerify() {
	return verify.map((item) => ({
		rel: "me" as const,
		href: item.value,
	}));
}
