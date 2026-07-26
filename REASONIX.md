# AGENTS.md

Shared context for every agent working in this directory: the
blog-writer subagent, the astro-dev subagent, and anything added
later. Agents read this first, then their own subagent file for
anything role-specific. No agent inherits another agent's
role-specific rules from here.

## What This Blog Is

Jeremy Sheeshka's blog on learning science, educational technology,
and the intersection of theory and classroom practice. Topics include
formative assessment, distributed cognition, TPACK, ZPD, constructive
alignment, and how people actually learn versus how institutions
assume they do. Audience is educators, instructional designers, and
people who think about learning. The voice lives in STYLE_GUIDE.md,
not here.

## File Structure

- Published posts: `src/content/post/*.mdx`
- Drafts: same directory, `draft: true` in frontmatter
- Images and media: `public/images/blog/<slug>/`
- **Image sourcing rule:** Do not download or add images to `public/images/` — the author supplies those. For permanent posts, use only images that already exist locally. For test/draft posts, you may use placeholder images from any online source (Unsplash, etc.) or reuse an existing local image as a filler.
- Slug convention: kebab-case matching the filename
- Content collection schema: `src/content.config.ts`
- Layouts: `src/layouts/`
- Components: `src/components/`

## Tech Stack

- Astro 5.x with MDX
- Tailwind CSS (see tailwind.config.ts)
- Linting and formatting: Biome (see biome.json)
- UI components: shadcn/ui (see components.json)
- Package manager: pnpm
- Build: `pnpm build`
- Dev server: `pnpm dev`
- Deploy: Netlify (see netlify.toml)
- Auto-deploy: Yes. Netlify builds and deploys automatically on push to main. No manual deploy step.
- Git remote: GitHub (origin). Default behavior is to push after completing work (see Rule 7).

## Hard Rules (Safety)

These apply to every agent in this directory, not just the writing
subagent.

1. Never invent a fact, statistic, citation, or quote. If the source
   material doesn't support a claim, flag the gap instead of filling
   it in.
2. Never attribute a claim to a named real person the author didn't
   actually make.
3. Agents may publish or push a post live without waiting on review
   first, but must always inform the author immediately when they do:
   what changed, where it's live, and how to revert it.
4. Never modify `astro.config.ts`, `src/layouts/`, or
   `src/components/` unless explicitly asked.
5. Never delete an existing post.
6. No naming students or real learners. No medical or legal advice presented as fact.
7. Never invent a personal anecdote, memory, feeling, or biographical detail that is not present in the notes or source material the author provided. If the notes do not say it happened, it did not happen. First-person voice is not a license to fabricate a first-person life. When the notes lack personal material, write the idea rather than a fake memory around it. Flag the gap if a section needs personal grounding the notes do not supply.
   or legal advice presented as fact]
7. **Auto-push default.** After completing a task that produces file changes (edit, create, move, delete), the agent must commit and push to `main` by default. The author may override this per-task by saying "don't push" or "no push." If a push was performed, notify the author immediately with a summary of what changed and a one-line revert instruction (`git revert <sha>`).

## Verification Steps

Run before considering any task done.

1. Run `pnpm build`. A broken build is a hard stop.
2. Confirm every inline citation number has a matching entry in that
   post's References section, and vice versa. No orphaned numbers
   either direction.
3. Confirm every citation resolves to a real, checkable source.
4. Confirm no rule in this file or the active subagent's file was
   silently skipped.
5. If a publish or push action was taken, confirm the author was
   notified with a summary of the change and a way to revert it.
