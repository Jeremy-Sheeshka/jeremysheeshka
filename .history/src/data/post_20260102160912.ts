import { type CollectionEntry, getCollection } from "astro:content";

/** filter out draft posts strictly */
export async function getAllPosts(): Promise<CollectionEntry<"post">[]> {
    return await getCollection("post", ({ data }) => {
        // This ensures drafts are hidden in both Dev and Production
        return !data.draft;
    });
}

/** Get tag metadata by tag name */
export async function getTagMeta(tag: string): Promise<CollectionEntry<"tag"> | undefined> {
    const tagEntries = await getCollection("tag", (entry) => {
        return entry.id === tag;
    });
    return tagEntries[0];
}

/** groups posts by year */
export function groupPostsByYear(posts: CollectionEntry<"post">[]) {
    return Object.groupBy(posts, (post) => post.data.publishDate.getFullYear().toString());
}

/** returns all tags created from posts */
export function getAllTags(posts: CollectionEntry<"post">[]) {
    return posts.flatMap((post) => [...post.data.tags]);
}

/** returns all unique tags created from posts */
export function getUniqueTags(posts: CollectionEntry<"post">[]) {
    return [...new Set(getAllTags(posts))];
}

/** returns a count of each unique tag */
export function getUniqueTagsWithCount(posts: CollectionEntry<"post">[]): [string, number][] {
    return [
        ...getAllTags(posts).reduce(
            (acc, t) => acc.set(t, (acc.get(t) ?? 0) + 1),
            new Map<string, number>(),
        ),
    ].sort((a, b) => b[1] - a[1]);
}