const { chromium } = require("@playwright/test");
const fs = require("fs");
const paths = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];
const exe = paths.find((p) => fs.existsSync(p));
const out = process.argv[2] || "public/og-image.png";
const src = process.argv[3] || "promo/og-card.html";
(async () => {
  const browser = await chromium.launch({ executablePath: exe, headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto("file:///" + require("path").resolve(src).replace(/\\/g, "/"), { waitUntil: "load" });
  try { await page.evaluate(() => document.fonts && document.fonts.ready); } catch {}
  await page.waitForTimeout(2500);
  const info = await page.evaluate(() => {
    const img = document.querySelector("img");
    return img ? { complete: img.complete, nw: img.naturalWidth, nh: img.naturalHeight, src: img.currentSrc } : null;
  });
  console.log("img:", JSON.stringify(info));
  await page.screenshot({ path: out });
  console.log("wrote " + out + " using " + exe);
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
