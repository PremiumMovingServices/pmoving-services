/**
 * Turns any text into a URL-safe slug: lowercase letters, numbers and single hyphens only.
 *
 * "Cost of Movers in Minnetonka & Excelsior, MN: What to Expect"
 *   -> "cost-of-movers-in-minnetonka-and-excelsior-mn-what-to-expect"
 *
 * Running it on an already clean slug returns the same slug.
 */
export function slugify(input: string): string {
	return input
		.normalize("NFKD")
		.replace(/[̀-ͯ]/g, "") // strip accents
		.replace(/['‘’]/g, "") // drop apostrophes: here's -> heres
		.replace(/&/g, " and ")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-") // everything else becomes a hyphen
		.replace(/^-+|-+$/g, ""); // no leading/trailing hyphens
}
