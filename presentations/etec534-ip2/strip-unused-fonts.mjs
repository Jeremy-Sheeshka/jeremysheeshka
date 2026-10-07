/**
 * strip-unused-fonts.mjs <rendered.html>
 *
 * Quarto's reveal.js theme always imports Source Sans Pro, and with
 * embed-resources every weight of it is baked into the file as base64 — about
 * 3 MB for a typeface this deck never sets (it uses Caveat and Courier Prime,
 * which are embedded from ./fonts by whiteout.css). There is no option to turn
 * the import off, so this removes those @font-face rules after rendering.
 *
 * It only ever deletes @font-face blocks that name Source Sans Pro, and it
 * leaves the file alone if it finds none.
 */
import { readFileSync, writeFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
	console.error("usage: node strip-unused-fonts.mjs <rendered.html>");
	process.exit(1);
}

const before = readFileSync(file, "utf8");
const FACE = /@font-face\s*\{[^}]*Source Sans Pro[^}]*\}\s*/g;
let removed = 0;

// Pandoc inlines the theme stylesheet as <link href="data:text/css,...">, percent-encoded.
const after = before.replace(/href="data:text\/css,([^"]*)"/g, (whole, encoded) => {
	if (!encoded.includes("Source%20Sans%20Pro")) return whole;
	const css = decodeURIComponent(encoded);
	const trimmed = css.replace(FACE, () => {
		removed += 1;
		return "";
	});
	return `href="data:text/css,${encodeURIComponent(trimmed)}"`;
});

if (removed === 0) {
	console.log("strip-unused-fonts: nothing to remove");
} else {
	writeFileSync(file, after);
	const mb = (n) => (n / 1048576).toFixed(2);
	console.log(
		`strip-unused-fonts: removed ${removed} Source Sans Pro faces, ${mb(before.length)} MB -> ${mb(after.length)} MB`,
	);
}
