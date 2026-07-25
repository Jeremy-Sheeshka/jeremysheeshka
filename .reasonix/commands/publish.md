---
description: Make a post live, build, commit, and push
argument-hint: [slug or commit message]
---

Publish workflow:

1. Make the post live. If "$ARGUMENTS" names a slug, set
   `draft: false` in `src/content/post/<slug>.mdx`. If no
   slug is given, find the most recently modified file in
   `src/content/post/` that still has `draft: true` and
   set it to `draft: false`. Tell me which file you flipped.
2. Run `pnpm build`. If it fails, stop and show me the
   errors. Do not proceed and do not push.
3. Run `git add -A`
4. Generate a commit message from the changed files.
   Format: "post: <slug> — <one-line summary>" for a new
   or edited post. "fix: <what changed>" for non-post
   changes. If "$ARGUMENTS" reads like a sentence rather
   than a slug, use it verbatim as the commit message.
5. Run `git commit -m "<message>"`
6. Run `git push`
7. Tell me which post went live, what was committed, the
   commit message, and confirm the push succeeded. Netlify
   deploys automatically on push, so there is no manual
   deploy step.
