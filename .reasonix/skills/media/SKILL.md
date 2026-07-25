---
name: media
description: Handle images and media for blog posts
runAs: inline
allowed-tools:
  - read_file
  - write_file
  - bash
  - glob
---

# Media Handler

When asked to handle images or media for a post:

1. Check `public/images/blog/<slug>/` for existing assets.
2. If I provide an image file, move it to the correct
   directory and update the frontmatter heroImage path.
3. If images are not .webp, offer to convert:
   `cwebp -q 80 -resize 1200 0 input.png -o output.webp`
4. Flag any image over 200KB.
5. Check that alt text exists for every image in the post.
6. If I ask for a diagram or chart, suggest whether it
   should be a static image, an inline SVG, or a JS
   library (and hand off to astro-dev if it is code).
7. Never delete existing images.
