# Prince Rupert Web Design — Landing Page

A North Coast themed web-design landing page modeled on West Coast Webs
(`page-www.westcoastwebs.com.html`), with skawennati-style hover interactivity
(hover sounds, image swaps, carousel, scroll reveals).

## Where it lives

| Piece | Path |
|---|---|
| Landing page (route `/prweb`) | `src/pages/prweb/index.astro` |
| Layout (nav + footer) | `src/layouts/PrinceRupertLayout.astro` |
| Head (meta, CSS/JS wiring) | `src/components/PrinceRupertBaseHead.astro` |
| Styles | `public/styles/prweb.css` |
| Interactivity | `public/js/prweb.js` |
| Themed artwork (SVG) | `public/images/prweb/` |

## Preview / launch

```bash
pnpm dev          # local dev → http://localhost:4321/prweb/
pnpm run build    # production build → dist/prweb/
```

The site deploys with the rest of the Astro project (GitHub Pages), so after a
push to `main` it is live at `https://jeremysheeshka.ca/prweb/`.

To launch it as its own site, point a new domain at the built `dist/` folder
(or a Netlify/Cloudflare Pages project rooted at this repo with build command
`pnpm run build` and output `dist`), then add a redirect or make `/prweb/`
the root path.

## Replacing placeholder artwork with your own photos

The current images are abstract SVG placeholders so the site is launch-ready
today. Swap them for your real material by replacing the files in
`public/images/prweb/` (keep the same filenames, or update the `src` in
`src/pages/prweb/index.astro`):

- `skeena-river.svg` / `skeena-river-fog.svg` — hero background (hover swaps
  between them, like skawennati's image swaps). Drop in your abstracted Skeena
  river photo(s).
- `container-ship.svg` / `container-ship-night.svg` — welcome section art
  (hover swaps day → night). Drop in your port / container ship photo(s).
- `logo.svg` — wordmark in the nav and footer.

## Quote form intake

The form at `#quote` is fully static:

1. If you set `data-endpoint` on the form (in `src/pages/prweb/index.astro`)
   to any POST-accepting JSON endpoint (Formspree, Netlify Forms, a
   Cloudflare Worker, etc.), submissions are sent there.
2. Otherwise it falls back to opening the visitor's mail client addressed to
   `hello@princerupertwebdesign.ca` with the request pre-filled.

Update the contact email in `public/js/prweb.js` and the footer/layout
(`src/layouts/PrinceRupertLayout.astro`) when you have your real address.

## Hover interactivity (skawennati-style)

- Any element with `data-sound="wave|foghorn|chime|chime-high|chime-low|gull"`
  plays a synthesized Web Audio sound on hover/focus — no audio files needed.
- Any `<img data-swap="/alt.jpg">` swaps its `src` on hover and restores on
  leave.
- A floating "Hover sounds on/off" pill lets visitors mute the audio
  (respects `prefers-reduced-motion` for motion).
- Testimonial slider autoplays every 6 s, pauses on hover, has manual dots.

## To customize content

Edit `src/pages/prweb/index.astro` — hero copy, services list, subscription
prices, client stories, featured-in names, and contact details are all there
in plain markup.
