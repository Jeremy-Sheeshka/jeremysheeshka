---
description: Build, commit, and push a blog post
argument-hint: [commit message or slug]
---

Publish workflow:

1. Run `pnpm build`. If it fails, stop and show me
   the errors. Do not proceed.
2. Run `git add -A`
3. Generate a commit message from the changed files.
   Format: "post: <slug> — <one-line summary>" for new
   or edited posts. "fix: <what changed>" for non-post
   changes. If I provided "$ARGUMENTS", use that as
   the commit message instead.
4. Run `git commit -m "<message>"`
5. Run `git push`
6. Tell me: what was committed, what the message was,
   and confirm the push succeeded.
7. If the deploy is manual (not auto-on-push), remind
   me of the deploy step.
