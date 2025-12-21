import { defineCollection, z } from "astro:content";

export const collections = {
  posts: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      tags: z.union([z.string(), z.array(z.string())]).optional(),
      draft: z.boolean().optional(),
    }),
  }),
};
