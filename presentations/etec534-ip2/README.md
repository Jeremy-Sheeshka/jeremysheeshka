# ETEC 534 IP#2: Painting Over the Mistake

A five-slide reveal.js deck (plus a cover and a reference list) on white-out as
an educational technology, built with Quarto. Every slide is a sheet of ruled
paper that gets typed on, painted over and written on again. The blog serves the
rendered file at `/etec534-ip2/`, and the post
`src/content/post/2026-09-26-etec534-ip2.mdx` is its cover page: an
introduction, the AI statement and a link to the deck.

## Rebuild

```sh
pnpm deck:ip2
```

That writes the photographs into `photo-parts.include.html`, renders
`ip2-whiteout.qmd`, strips a typeface Quarto adds but the deck never uses, and
copies the result to `public/etec534-ip2/index.html`. It needs Quarto and Node,
and nothing else.

## What to edit

| File | What it is |
| --- | --- |
| `ip2-whiteout.qmd` | The slides and the speaker notes. The notes are the `::: {.notes}` blocks. The comment at the top explains the markup. |
| `whiteout.css` | Colours, type, layout, the page turn and the sticky notes. |
| `deck-script.include.html` | Draws the pen lines, lays the ruled paper, loosens the lettering, paints the patches, shows the notes, and opens pictures larger when they are clicked. |
| `deck-parts.include.html` | The ruled page, the masking tape, the sticky note and the filters. |
| `make-photo-parts.mjs` | The list of photographs. Add a line here to use a new one as `<use href="#ph-name">`. |
| `img/` | The comic, the advertisement and the photographs (`cut-*.webp` are cut-outs). `img/unused/` holds earlier images that are no longer shown. |
| `fonts/` | Caveat, Special Elite and Courier Prime, embedded into the file at render. |

The picture on the post page is a screenshot of the finished cover slide, saved
as `src/assets/images/blog/etec534-ip2-cover.jpg`. Retake it if the cover changes.

## Generated

`photo-parts.include.html` is written by `make-photo-parts.mjs` on every build.
`vendor/rough.js` ([Rough.js](https://roughjs.com)) is written by
`sketch/build-parts.mjs` and only needs regenerating if that library is updated
(`cd sketch && npm install && npm run parts`). The same script still writes
`sketchbook-parts.include.html`, which the deck no longer uses.

## In the deck

- The arrow keys or the space bar turn the page. **T** shows or hides the
  speaker notes. **S** opens reveal's presenter view.
- The comic, the advertisement and the photograph on the cover can be clicked
  (or reached with Tab and opened with Enter) to see them larger.
- On slide 3, writing on the patch before it has dried smudges it. That is on
  purpose. Step back and wait about three seconds (the shine goes off the patch
  as it dries).
- Add `?print-pdf` to the address, then print from the browser, for a PDF.
