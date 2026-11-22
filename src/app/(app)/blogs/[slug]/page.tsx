import { getPayload } from "payload";
import type { Where } from "payload";
import config from "@payload-config";
import { OurLocations } from "@/components/OurLocations";

import type { Metadata } from "next";
import type { Blog } from "@/payload-types";
import { BASE_URL, COMPANY } from "@/utils";
import { Post } from "./post";
import { notFound, permanentRedirect } from "next/navigation";
import { ChartRenderer } from "@/components/ChartRenderer";
import { slugify } from "@/collections/hooks/slugify";

type Props = {
	params: Promise<{ slug: string }>;
};

function safeDecode(value: string) {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

/**
 * Finds a blog from the slug in the URL.
 *  1. exact match (the normal case)
 *  2. exact match on the cleaned-up slug (old URLs that contained ? & , : ' etc.)
 *  3. partial match (kept because old-site redirects point at shortened slugs)
 *
 * `exact` is false for 2 and 3, so the page can 308-redirect to the single
 * canonical URL instead of serving the same blog under several URLs.
 */
async function findBlog(rawSlug: string) {
	const slug = safeDecode(rawSlug);
	const payload = await getPayload({ config });

	const find = async (where: Where) =>
		(await payload.find({ collection: "blogs", where, limit: 1 }))
			.docs[0] as Blog | undefined;

	const exact = await find({ slug: { equals: slug } });
	if (exact) return { blog: exact, exact: true };

	const cleaned = slugify(slug);
	if (cleaned && cleaned !== slug) {
		const byCleaned = await find({ slug: { equals: cleaned } });
		if (byCleaned) return { blog: byCleaned, exact: false };
	}

	const partial = await find({ slug: { contains: slug } });
	return { blog: partial, exact: false };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug: rawSlug } = await params;

	const { blog } = await findBlog(rawSlug);

	if (!blog) {
		return {
			title: "Sorry! This blog does not exist",
			description:
				"We couldn't find the blog post you were looking for. It might have been moved, deleted, or the link might be incorrect. Please check the URL or try searching our site.",
		};
	}

	// Always the blog's real slug, never whatever variation was requested.
	const canonicalUrl = `${BASE_URL}/blogs/${encodeURIComponent(blog.slug)}`;

	// og-image / twitter card image
	let imageUrl = "";
	if (typeof blog.thumbnail === "object" && blog.thumbnail !== null) {
		imageUrl = blog.thumbnail.url || "";
	}

	const title = blog.title;

	const description = blog.thumbnailDescription
		? `${blog.thumbnailDescription.substring(0, 155)}...`
		: `Read our latest blog post titled "${title}" on the "Premium Moving Services blog". Find useful information and tips.`;

	const keywords = [
		...(Array.isArray(blog.tags) ? blog.tags : []),
		`${blog.title}`,
		`movers in ${blog.title}`,
		"moving services",
		"professional movers",
		"local movers",
		"residential moving",
		"commercial moving",
	];

	return {
		title,
		description,
		authors: [{ name: COMPANY, url: BASE_URL }],
		applicationName: COMPANY,
		referrer: "origin-when-cross-origin",
		creator: COMPANY,
		publisher: COMPANY,
		keywords,
		alternates: {
			canonical: canonicalUrl,
		},
		openGraph: {
			type: "website",
			title,
			description,
			locale: "en_US",
			images: [
				{ url: imageUrl, width: 1200, height: 630, alt: `${title} thumbnail` },
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			creatorId: "info@pmovingservices.com",
			site: "info@pmovingservices.com",
			images: [
				{ url: imageUrl, width: 1200, height: 630, alt: `${title} thumbnail` },
			],
		},
		robots: {
			index: true,
			follow: true,
			"max-snippet": -1,
			"max-image-preview": "large",
			"max-video-preview": -1,
		},
	};
}

export default async function SingleBlogPage({ params }: Props) {
	const resolvedParams = await params;

	const { blog, exact } = await findBlog(resolvedParams.slug);

	if (!blog) {
		return notFound();
	}

	// Old / shortened / malformed URL: send visitors and Google to the one real URL.
	if (!exact) {
		permanentRedirect(`/blogs/${encodeURIComponent(blog.slug)}`);
	}

	const chartData = blog.chart;

	return (
		<section className="max-w-7xl w-full mx-auto p-6 mt-3 lg:px-8 pt-0 xl:pt-6">
			<Post content={blog?.content} id={blog.id} />
			<ChartRenderer chart={chartData} />
			<OurLocations />
		</section>
	);
}
