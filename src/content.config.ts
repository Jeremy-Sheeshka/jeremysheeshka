import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function removeDupsAndLowerCase(array: string[]) {
	return [...new Set(array.map((str) => str.toLowerCase()))];
}

const titleSchema = z.string().max(160);

const baseSchema = z.object({
	title: titleSchema,
});

const post = defineCollection({
	loader: glob({ base: "./src/content/post", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		baseSchema.extend({
			description: z.string(),
			coverImage: z
				.object({
					alt: z.string(),
					src: image(),
				})
				.optional(),
			draft: z.boolean().default(false),
			ogImage: z.string().optional(),
			tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
			publishDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			pinned: z.boolean().default(false),
			// Render the piece as the page itself instead of a post with chrome.
			immersive: z.boolean().default(false),
			/*
			 * A slide deck built elsewhere (Quarto + reveal.js) and staged as a
			 * self-contained HTML file in public/. The post keeps all of its
			 * ordinary metadata — it still appears in the archive, tag pages,
			 * RSS, Pagefind and the OG image — but its own route renders the
			 * deck full-viewport instead of a post page with a link to it. No
			 * cover, no interstitial: clicking the post in the archive is
			 * landing in the presentation.
			 */
			presentation: z
				.object({
					// Absolute path under public/, e.g. "/etec534-ip2/".
					href: z.string().startsWith("/"),
					// The colour around the slides, so the page behind the deck
					// matches it while the deck loads. Defaults to a dark shell.
					background: z
						.string()
						.regex(/^#[0-9a-fA-F]{6}$/)
						.default("#181511"),
				})
				.optional(),
		}),
});

const note = defineCollection({
	loader: glob({ base: "./src/content/note", pattern: "**/*.{md,mdx}" }),
	schema: baseSchema.extend({
		description: z.string().optional(),
		publishDate: z
			.string()
			.datetime({ offset: true })
			.transform((val) => new Date(val)),
	}),
});

const tag = defineCollection({
	loader: glob({ base: "./src/content/tag", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: titleSchema.optional(),
		description: z.string().optional(),
	}),
});

export const collections = { post, note, tag };