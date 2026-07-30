#!/usr/bin/env bash
set -euo pipefail

# Resolve repo root dynamically
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "ERROR: Not inside a git repository. Run this script from within the repo." >&2
  exit 1
}
cd "$REPO_ROOT"

# Derive repo name from the directory
REPO_NAME="$(basename "$REPO_ROOT")"
TIMESTAMP="$(date +%Y-%m-%d-%H%M%S)"
ARCHIVE_NAME="${REPO_NAME}-backup-${TIMESTAMP}.tar.gz"
ARCHIVE_PATH="$(dirname "$REPO_ROOT")/${ARCHIVE_NAME}"

echo "Creating archive: $ARCHIVE_PATH"

# Create tarball excluding heavyweight / VCS directories
tar -czf "$ARCHIVE_PATH" \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='dist' \
  --exclude='.astro' \
  --exclude='.git' \
  -C "$(dirname "$REPO_ROOT")" \
  "$REPO_NAME"

# Report
echo "Archive: $ARCHIVE_PATH"
echo "Size:    $(du -h "$ARCHIVE_PATH" | cut -f1)"
