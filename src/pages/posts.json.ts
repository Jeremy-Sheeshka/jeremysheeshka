/**
 * Static prerendered JSON endpoint — emits the complete post archive
 * for the MET dashboard to consume at build time.
 */
export const prerender = true;

import { getCollection } from "astro:content";

const BLOG_URL = "https://jeremysheeshka.ca";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function deriveCourse(tags: string[]): string | null {
  if (!tags || tags.length === 0) return null;
  for (const tag of tags) {
    const m = tag.match(/etec\s*(\d{3})/i);
    if (m) return `ETEC${m[1]}`;
  }
  return null;
}

function parseComponentImports(body: string): string[] {
  const re = /^import\s+(?:\{\s*([^}]+)\s*\}|(\w+))\s+from\s+["']\.\.\/\.\.\/components\//gm;
  const names: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    if (m[1]) {
      names.push(...m[1].split(",").map((s) => s.trim()).filter(Boolean));
    } else if (m[2]) {
      names.push(m[2]);
    }
  }
  return [...new Set(names)];
}

function stripMarkdown(text: string): string {
  return text
    .replace(/^---[\s\S]*?---/m, "")
    .replace(/^import\s+.*$/gm, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[#*`~\[\]|>!_]/g, "")
    .replace(/\{:[^}]+\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Resolve a ../../assets/... path to its deployed URL.
 * Astro copies src/assets/ → dist/assets/ preserving the directory
 * structure, so ../../assets/images/blog/foo.png (relative to
 * src/content/post/) resolves to https://<blog>/assets/images/blog/foo.png.
 */
function resolveAssetPath(relPath: string): string {
  const stripped = relPath.replace(/^\.\.\/\.\.\/assets\//, "");
  return `${BLOG_URL}/assets/${stripped}`;
}

function normalizeBody(body: string): string {
  let out = body;

  // ../../assets/.../foo.ext → https://jeremysheeshka.ca/assets/...
  out = out.replace(
    /(["'(])(\.\.\/\.\.\/assets\/[^"'\s)]+)/g,
    (_m: string, quote: string, path: string) =>
      `${quote}${resolveAssetPath(path)}`,
  );

  // src="/X" and href="/X" (not http:// or https://)
  out = out.replace(
    /(\s(?:src|href|poster|data-src)=["'])\/(?!\/)([^"']+)/g,
    `$1${BLOG_URL}/$2`,
  );

  // Markdown links: ](/X) — not http
  out = out.replace(
    /\]\(\/(?!\/)([^)\s]+)\)/g,
    `](${BLOG_URL}/$1)`,
  );

  return out;
}

// ---------------------------------------------------------------------------
// Endpoint
// ---------------------------------------------------------------------------

export async function GET() {
  const posts = await getCollection("post");

  const archive = posts
    .filter((p) => !p.data.draft)
    .map((entry) => {
      const rawBody = entry.body ?? "";
      const { title, description, tags, publishDate } = entry.data;

      const plainText = stripMarkdown(rawBody);
      const wordCount = countWords(plainText);
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));
      const excerpt = plainText.slice(0, 200) + (plainText.length > 200 ? "…" : "");
      const interactive = /<script\b/i.test(rawBody);
      const componentImports = parseComponentImports(rawBody);
      const course = deriveCourse(tags ?? []);
      const slug = entry.id;
      const url = `${BLOG_URL}/posts/${slug}/`;

      return {
        slug,
        title,
        date: publishDate.toISOString(),
        description,
        course,
        tags,
        url,
        excerpt,
        body: normalizeBody(rawBody),
        readingTime,
        interactive,
        componentImports,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return new Response(JSON.stringify(archive, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
