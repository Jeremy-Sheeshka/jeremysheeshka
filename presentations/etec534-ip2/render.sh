#!/usr/bin/env bash
#
# Render the ETEC 534 IP#2 deck and stage it where the blog serves it.
#
#   pnpm deck:ip2
#
# Requires Quarto on PATH (https://quarto.org/docs/get-started/) and Node, which
# the blog already needs. The deck is a single self-contained HTML file
# (embed-resources: true), so staging it is just one copy — everything the
# browser needs, including the images, the fonts and reveal.js itself, is inside
# that file.
#
# vendor/rough.js is committed, so nothing needs installing to render. (It was
# written there by sketch/build-parts.mjs: cd sketch && npm install && npm run parts.)
# The photographs are written into photo-parts.include.html by make-photo-parts.mjs,
# which this script runs first.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo="$(cd "$here/../.." && pwd)"

if ! command -v quarto >/dev/null 2>&1; then
  echo "quarto not found on PATH. Install it, or run this with the full path," >&2
  echo "e.g. ~/.local/bin/quarto." >&2
  exit 1
fi

if [ ! -f "$here/vendor/rough.js" ]; then
  echo "missing vendor/rough.js — run: cd presentations/etec534-ip2/sketch && npm install && npm run parts" >&2
  exit 1
fi

node "$here/make-photo-parts.mjs"

# Quarto writes a cache under $HOME by default, which is outside the repo. Point
# every XDG directory it touches at a repo-local folder instead, so rendering
# never depends on — or clobbers — anything in the user's home directory.
export XDG_CACHE_HOME="$repo/.quarto-cache"
export XDG_DATA_HOME="$repo/.quarto-cache/data"
export XDG_CONFIG_HOME="$repo/.quarto-cache/config"
export DENO_DIR="$repo/.quarto-cache/deno"
mkdir -p "$XDG_CACHE_HOME" "$XDG_DATA_HOME" "$XDG_CONFIG_HOME" "$DENO_DIR"

quarto render "$here/ip2-whiteout.qmd"

# Quarto bakes in ~3 MB of a typeface the deck never uses. Take it back out.
node "$here/strip-unused-fonts.mjs" "$here/ip2-whiteout.html"

mkdir -p "$repo/public/etec534-ip2"
cp "$here/ip2-whiteout.html" "$repo/public/etec534-ip2/index.html"

echo
echo "staged -> public/etec534-ip2/index.html"
echo "the post at /posts/2026-09-26-etec534-ip2/ links to it."
