import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public");
const logoPath = process.env.LOGO || "C:\\Users\\Sanju\\Projects\\vvitlogo.jpg";

async function logWritten(file, label) {
  const meta = await sharp(file).metadata();
  const rel = path.relative(root, file).split(path.sep).join("/");
  console.log(`written  ${rel}  (${meta.width}x${meta.height})  [${label}]`);
}

async function generate() {
  await mkdir(outDir, { recursive: true });

  /* 1) favicon.png — trimmed logo, 64x64 */
  const faviconPath = path.join(outDir, "favicon.png");
  await sharp(logoPath).trim().resize(64, 64).png().toFile(faviconPath);
  await logWritten(faviconPath, "favicon");

  /* 2) apple-touch-icon.png — trimmed logo, 180x180 */
  const applePath = path.join(outDir, "apple-touch-icon.png");
  await sharp(logoPath).trim().resize(180, 180).png().toFile(applePath);
  await logWritten(applePath, "apple-touch-icon");

  /* 3) og-image.png — 1200x630 composed card */
  const ogSvg = Buffer.from(
    `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#7C6CFF" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#7C6CFF" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(124,108,255,0.06)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#05060a"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <ellipse cx="900" cy="315" rx="320" ry="320" fill="url(#glow)"/>
  <circle cx="900" cy="315" r="170" fill="#ffffff"/>
  <circle cx="900" cy="315" r="170" fill="none" stroke="#7C6CFF" stroke-width="4" opacity="0.9"/>
  <text x="90" y="260" font-family="Arial, Helvetica, sans-serif" font-size="80" font-weight="bold" fill="#ffffff">HACK-MATRIX</text>
  <text x="90" y="348" font-family="Arial, Helvetica, sans-serif" font-size="80" font-weight="bold" fill="#9AA3B2">2026</text>
  <rect x="90" y="378" width="220" height="4" rx="2" fill="#7C6CFF"/>
  <text x="90" y="435" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#9AA3B2">8-Hour Inter-Collegiate Hackathon &#183; VVIT Bengaluru</text>
</svg>`,
    "utf8"
  );

  /* Circular-clipped 320x320 logo so its square corners never spill past the white disc */
  const circleMask = Buffer.from(
    '<svg width="320" height="320" xmlns="http://www.w3.org/2000/svg"><circle cx="160" cy="160" r="160" fill="#ffffff"/></svg>'
  );
  const roundLogo = await sharp(logoPath)
    .trim()
    .resize(320, 320, { fit: "cover" })
    .composite([{ input: circleMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const ogPath = path.join(outDir, "og-image.png");
  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 5, g: 6, b: 10, alpha: 1 },
    },
  })
    .composite([
      { input: ogSvg },
      { input: roundLogo, left: 740, top: 155 },
    ])
    .png()
    .toFile(ogPath);
  await logWritten(ogPath, "og-image");
}

generate()
  .then(() => {
    process.exitCode = 0;
  })
  .catch((err) => {
    console.error("generate-assets failed:", err);
    process.exit(1);
  });
