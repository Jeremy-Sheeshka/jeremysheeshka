// Post-build step: @astrojs/sitemap v3 always emits sitemap-index.xml + sitemap-0.xml.
// GitHub Pages serves no redirects, so make a real /sitemap.xml available
// (same content as the index) for Search Console / crawlers expecting sitemap.xml.
import { copyFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const index = resolve(dist, "sitemap-index.xml");
const target = resolve(dist, "sitemap.xml");

if (existsSync(index)) {
    copyFileSync(index, target);
    console.log("[fix-sitemap] ✓ wrote dist/sitemap.xml (copy of sitemap-index.xml)");
} else {
    console.warn("[fix-sitemap] ⚠ sitemap-index.xml not found in dist/ — skipping");
}
