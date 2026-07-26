#!/usr/bin/env python3
import os, re, glob

POST_DIR = "src/content/post"
GUIDE = ".reasonix/skills/blog-writer/STYLE_GUIDE.md"
HEADER = "Voice Exemplars (from published posts)"

FIRST_PERSON = re.compile(r"\bI\b|\bI'm\b|\bmy\b|\bI'd\b|\bI've\b")
QUESTION = re.compile(r"\?")

def short_sentence_count(text):
    sents = re.split(r'(?<=[.!?])\s+', text)
    return sum(1 for s in sents if 0 < len(s.split()) <= 12)

def strip_mdx(raw):
    raw = re.sub(r'^---\n.*?\n---\n', '', raw, flags=re.DOTALL)
    out = []
    in_code = False
    in_refs = False
    for line in raw.split('\n'):
        s = line.strip()
        if s.startswith('```'):
            in_code = not in_code
            continue
        if in_code:
            continue
        if re.match(r'^#{1,6}\s*References\b', s) or s == 'References':
            in_refs = True
        if in_refs:
            continue
        if s.startswith('import '):
            continue
        if s.startswith('#'):
            continue
        if re.match(r'^</?[A-Z][A-Za-z]*', s) and (s.endswith('>') or s.endswith('/>')):
            continue
        if s.startswith('!['):
            continue
        if re.match(r'^(-{3,}|\*{3,})$', s):
            continue
        out.append(line)
    return '\n'.join(out)

def paragraphs(text):
    result = []
    for p in re.split(r'\n\s*\n', text):
        p = p.strip()
        if not p:
            continue
        p = re.sub(r'<[A-Z][A-Za-z]*[^>]*/>', '', p)
        p = re.sub(r'</?[A-Z][A-Za-z]*[^>]*>', '', p)
        p = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', p)
        p = re.sub(r'\[\d+\]', '', p)
        p = re.sub(r'\s+', ' ', p).strip()
        if p:
            result.append(p)
    return result

def score(p):
    s = 0
    if FIRST_PERSON.search(p): s += 2
    if QUESTION.search(p): s += 2
    s += min(short_sentence_count(p), 4)
    words = len(p.split())
    if 25 <= words <= 90: s += 2
    elif words < 15: s -= 2
    if p.count('; ') >= 3: s -= 1
    return s

candidates = []
files = sorted(glob.glob(os.path.join(POST_DIR, "*.mdx")))
sampled_from = 0
for f in files:
    with open(f, encoding='utf-8') as fh:
        raw = fh.read()
    fm = re.match(r'^---\n(.*?)\n---\n', raw, flags=re.DOTALL)
    if fm and re.search(r'draft:\s*true', fm.group(1)):
        continue
    sampled_from += 1
    slug = os.path.basename(f).replace('.mdx', '')
    for p in paragraphs(strip_mdx(raw)):
        if len(p.split()) < 12:
            continue
        sc = score(p)
        if sc >= 3:
            candidates.append((sc, slug, p))

candidates.sort(key=lambda x: -x[0])

selected = []
per_post = {}
for sc, slug, p in candidates:
    if per_post.get(slug, 0) >= 2:
        continue
    if any(p[:60] == q[:60] for _, _, q in selected):
        continue
    selected.append((sc, slug, p))
    per_post[slug] = per_post.get(slug, 0) + 1
    if len(selected) >= 10:
        break

lines = [HEADER, ""]
lines.append("Sampled automatically from published posts in src/content/post/.")
lines.append("Drafts are excluded. Re-run `.reasonix/sample_voice.py` to refresh")
lines.append("as the archive grows. These are real paragraphs, not imitations.")
lines.append("Read them as calibration for the texture the rules describe.")
lines.append("Each is tagged with its source post. Prune any that do not fit.")
lines.append("")
for sc, slug, p in selected:
    lines.append(f"From `{slug}`:")
    lines.append("")
    lines.append(p)
    lines.append("")

new_section = '\n'.join(lines).rstrip() + '\n'

with open(GUIDE, encoding='utf-8') as fh:
    guide = fh.read()
idx = guide.find(HEADER)
if idx == -1:
    raise SystemExit("Header not found in STYLE_GUIDE.md; aborting.")
with open(GUIDE, 'w', encoding='utf-8') as fh:
    fh.write(guide[:idx] + new_section)

print(f"Sampled {sampled_from} published posts ({len(files)} files, drafts excluded).")
print(f"Wrote {len(selected)} exemplar paragraphs to STYLE_GUIDE.md:")
for sc, slug, p in selected:
    print(f"  [score {sc}] {slug}: {p[:75]}...")
