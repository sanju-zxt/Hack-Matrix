/**
 * Build the printable HACK-MATRIX 2026 brochure.
 *
 *   node tool/build-brochure.mjs
 *
 * Reads  → brochure/hack-matrix-brochure.html   (template, logo + QR placeholders inline)
 * Writes → dist/brochure/hack-matrix-brochure.html  (self-contained, both assets as data URIs)
 *
 * The template emits seven portrait DL pages (99 x 210 mm). Prefer `npm run brochure`
 * (this step + tool/render-brochure.mjs), which exports the PDF and per-page previews for
 * you. To print by hand instead: print dist/brochure/hack-matrix-brochure.html with paper
 * size 99 x 210 mm, margins "None" and "Background graphics" enabled.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const templatePath = join(root, "brochure", "hack-matrix-brochure.html");
const logoPath = process.env.LOGO
  ? resolve(root, process.env.LOGO)
  : join(root, "public", "vvitlogo.jpg");
const qrPath = join(root, "brochure", "hack-matrix-qr.svg");
const outDir = join(root, "dist", "brochure");
const outPath = join(outDir, "hack-matrix-brochure.html");

const MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

if (!existsSync(templatePath)) {
  throw new Error(`Missing brochure template: ${templatePath}`);
}
if (!existsSync(logoPath)) {
  throw new Error(`Missing logo: ${logoPath} (override with the LOGO env var)`);
}
if (!existsSync(qrPath)) {
  throw new Error(`Missing QR asset: ${qrPath} (regenerate with: python tool/make-qr.py)`);
}

/** Reads an asset and returns it as an inline `data:` URI. */
const inline = (path) => {
  const ext = path.slice(path.lastIndexOf(".")).toLowerCase();
  const mime = MIME[ext] ?? "application/octet-stream";
  return `data:${mime};base64,${readFileSync(path).toString("base64")}`;
};

const logoDataUri = inline(logoPath);
const qrDataUri = inline(qrPath);

let html = readFileSync(templatePath, "utf8")
  .replaceAll("__LOGO_DATA_URI__", logoDataUri)
  .replaceAll("__QR_DATA_URI__", qrDataUri);

const leftovers = html.match(/__[A-Z0-9_]+__/g);
if (leftovers) {
  throw new Error(`Unsubstituted placeholder(s) in the template: ${[...new Set(leftovers)].join(", ")}`);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, html, "utf8");

console.log(`[brochure] ${outPath}`);
console.log(
  `[brochure] inlined logo ${logoPath} (${Math.round(logoDataUri.length / 1024)} KB data URI)`,
);
console.log(`[brochure] inlined QR   ${qrPath} (${Math.round(qrDataUri.length / 1024)} KB data URI)`);