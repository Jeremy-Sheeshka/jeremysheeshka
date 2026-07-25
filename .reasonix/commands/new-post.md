---
description: Scaffold a new blog post with frontmatter and outline
argument-hint: <topic or title>
---

Create a new blog post about: $ARGUMENTS

Steps:
1. Generate a kebab-case slug from the topic.
2. Read 3-5 existing posts in `src/content/blog/` to
   see the frontmatter fields and tag vocabulary in use.
3. Create `src/content/blog/<slug>.mdx` with valid
   frontmatter matching the existing schema.
4. Set `pubDate` to today's date. Set `draft: true`.
5. Write a `description` under 160 characters.
6. Suggest 3-5 tags reusing existing tags where possible.
7. Write a skeleton outline with H2 sections. No body
   text yet.
8. Create the image directory: `public/images/blog/<slug>/`
9. Print a summary of what was created and what I
   should do next.
