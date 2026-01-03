---
title: "The Mega Template: Ultimate Layout Guide"
description: "A library of every possible element for your blog posts."
publishDate: 2026-01-03
tags: ["Template", "Reference", "Astro"]
# --- DRAFT SETTINGS ---
# draft: true                # Uncomment this to hide the post from the live site
# ogImage: "/assets/card.png" # Custom social media preview image
# --- LAYOUT SETTINGS ---
showToc: false # Keep false to avoid the '#' anchor bug
# layout: "../../layouts/WideBody.astro" # If you ever create custom layouts
---

<style>
  /* CORE THEMEING */
  .post-body {
    color: var(--theme-text, #1a1a1a);
    line-height: 1.7;
    max-width: 75ch;
    margin: 0 auto;
    padding-bottom: 5rem;
  }
  
  /* HIDE THE '#' ANCHORS */
  .header-anchor, .anchor-link, .toc-container { display: none !important; }

  /* FLEXBOX COLUMNS (Side-by-Side text/images) */
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    margin: 2rem 0;
    align-items: center;
  }
  .col { flex: 1; min-width: 300px; }

  /* INFO BOXES (Different Colors) */
  .box { padding: 1.25rem; border-radius: 8px; margin: 1.5rem 0; border-left: 6px solid; }
  .box-info { background: #e0f2fe; border-color: #0ea5e9; color: #0369a1; } /* Blue */
  .box-warn { background: #fef3c7; border-color: #f59e0b; color: #92400e; } /* Orange */
  .box-crit { background: #fee2e2; border-color: #ef4444; color: #991b1b; } /* Red */

  /* BUTTONS */
  .btn {
    display: inline-block;
    padding: 0.8rem 1.5rem;
    background: var(--theme-accent, #2563eb);
    color: white !important;
    border-radius: 6px;
    text-decoration: none;
    font-weight: bold;
    transition: opacity 0.2s;
  }
  .btn:hover { opacity: 0.8; }

  /* VIDEO WRAPPER (Responsive 16:9) */
  .video-wrapper {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    margin: 2rem 0;
  }
  .video-wrapper iframe {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    border-radius: 12px;
  }
</style>

<div class="post-body">

## 1. Organizing Your Content

### Side-by-Side (Image & Text)

Use the `row` and `col` classes to put an image next to an explanation.

<div class="row">
  <div class="col">
    <strong>The Concept:</strong>
    Explain your theory or idea here. This column will wrap underneath the image on mobile devices automatically.
  </div>
  <div class="col">
    <img src="../../assets/images/blog/ogreOnions.png" style="border-radius: 8px; width: 100%;" />
  </div>
</div>

---

## 2. Attention Grabbers (Alert Boxes)

<div class="box box-info">
  <strong>Note:</strong> This is a standard info box for general tips.
</div>

<div class="box box-warn">
  <strong>Warning:</strong> Use this for things students or readers should avoid.
</div>

---

## 3. Interactive Elements

### External Links as Buttons

Instead of a tiny link, make it a call to action:

<div style="text-align: center; margin: 2rem 0;">
  <a href="https://jeremysheeshka.ca" class="btn">View Portfolio Project</a>
</div>

### YouTube Embed

To embed a video, use this wrapper (keeps it from breaking on mobile):

<div class="video-wrapper">
  <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video" frameborder="0" allowfullscreen></iframe>
</div>

---

## 4. Academic & Research Tools

### Using Abbreviations

You can use the HTML `<abbr>` tag: <abbr title="Zone of Proximal Development">ZPD</abbr> (hover your mouse over that word!).

### Highlighting Text

Sometimes you want to <span style="background-color: yellow; color: black; padding: 0 4px;">highlight specific strings</span> of text within a sentence.

### Footnotes

You can simulate footnotes like this:
The theory of Constructivism<sup>[1]</sup> is vital.

---

## 5. Metadata Options (Frontmatter)

Next week, look at the top of this file. You can:

- **Drafts:** Change `draft: false` to `true` to work on a post without it appearing on the home page.
- **Date:** Set a future date to "schedule" a post (Netlify won't show it until that day).
- **Tags:** Add as many as you want in the `["Tag1", "Tag2"]` format.

<div style="margin-top: 5rem; font-size: 0.8rem; opacity: 0.6; border-top: 1px solid #ccc; padding-top: 1rem;">
  [1] Reference details would go down here at the very bottom.
</div>

</div>
