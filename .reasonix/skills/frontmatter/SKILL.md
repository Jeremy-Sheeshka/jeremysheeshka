---
name: frontmatter
description: Generate or fix frontmatter for a blog post, matching existing conventions
runAs: inline
allowed-tools:
  - read_file
  - write_file
  - grep
  - glob
---

# Frontmatter Generator

When asked to generate or fix frontmatter:

1. Read 3-5 existing published posts in
   `src/content/blog/` to see the actual frontmatter
   fields in use. Match what exists. Do not invent
   new fields.
2. Read `src/content.config.ts` to confirm the schema.
3. Generate frontmatter that matches both.
4. For tags: scan existing posts and reuse tags already
   in use. Only create a new tag if the topic genuinely
   has no match. Show me the existing tags you considered.
5. For description: under 160 characters, contains the
   primary topic naturally, reads like a human wrote it.
6. For heroImage: follow the existing path convention.
   If no image exists yet, set the path and tell me
   I need to add the file.
7. Set `draft: true` on new posts.
8. Show me the frontmatter before writing it. Wait for
   approval.
