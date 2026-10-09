/**
 * Visual QA + PDF export for the printable brochure.
 *
 *   node tool/render-brochure.mjs
 *
 * Reads  → dist/brochure/hack-matrix-brochure.html
 * Writes → dist/brochure/hack-matrix-brochure.pdf
 *          dist/brochure/preview/page-{1..6}.png
 *
 * Geometry: the brochure is a 6-page DL booklet — exactly 6 .page elements,
 * each 99mm WIDE x 210mm TALL (portrait DL). There is NO .panels wrapper and
 * NO .panel elements. Page size comes from the template's `@page { size: 99mm 210mm; margin: 0 }`
 * rule via `preferCSSPageSize`, and the exported PDF's MediaBox is re-measured afterwards.
 *
 * Overflow check: every .page is exactly 99mm x 210mm; any content pushed past the
 * bottom/right edge of each page's content box is reported so nothing silently spills
 * onto an extra printed page. Per-page overflow is checked against the page's content
 * box (border box minus border and padding) in BOTH screen and print media.
 *
 * Asset check: inlined <img> elements must rasterise. The logo appears exactly ONCE
 * in the whole brochure (raster image, typically JPEG) and the QR appears exactly
 * ONCE (separate inline <img>, SVG). Expected total <img> count is 2. Non-blankness/
 * rasterisation checks apply to both.
 *
 * Design system check: the template is a dark HUD / technical blueprint; furniture
 * checks are preserved (reticle/brackets, stamp, ghostnum where applicable), .tick-list
 * bullets stay glyphs, palette enforcement and hairline thickness checks remain.
 *
 * Contract: Exit with code 1 on any geometry violation, page overflow (screen OR print),
 * clipped text, broken/blank asset, wrong logo/QR count, or design system violation;
 * exit 0 when there are only contrast/overlap/webfont advisory warnings.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

/** Same system-browser fallback as playwright.config.ts, so no `npx playwright install` is needed. */
const SYSTEM_BROWSERS = [
  ["Google Chrome", "Google", "Chrome", "Application", "chrome.exe"],
  ["Microsoft Edge", "Microsoft", "Edge", "Application", "msedge.exe"],
];

async function launchChromium() {
  try {
    return { browser: await chromium.launch({ headless: true }), label: "Playwright Chromium" };
  } catch {
    const roots = [process.env.PROGRAMFILES, process.env["PROGRAMFILES(X86)"], process.env.LOCALAPPDATA].filter(
      (dir) => Boolean(dir),
    );
    for (const [label, ...parts] of SYSTEM_BROWSERS) {
      for (const root of roots) {
        const executablePath = join(root, ...parts);
        if (!existsSync(executablePath)) continue;
        return { browser: await chromium.launch({ headless: true, executablePath }), label };
      }
    }
    throw new Error(
      "No Chromium found. Install Google Chrome or Microsoft Edge, or run `npx playwright install chromium`.",
    );
  }
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "dist", "brochure");
const htmlPath = join(outDir, "hack-matrix-brochure.html");
const pdfPath = join(outDir, "hack-matrix-brochure.pdf");
const previewDir = join(outDir, "preview");

/** Reads the exported PDF's MediaBox entries so page size is verified, not assumed. */
function inspectPdf(raw) {
  const PT_PER_MM = 72 / 25.4;
  const pages = [...raw.matchAll(/\/MediaBox\s*\[\s*([\d.+-]+)\s+([\d.+-]+)\s+([\d.+-]+)\s+([\d.+-]+)\s*\]/g)].map(
    (m) => ({
      widthMm: Math.round(((Number(m[3]) - Number(m[1])) / PT_PER_MM) * 100) / 100,
      heightMm: Math.round(((Number(m[4]) - Number(m[2])) / PT_PER_MM) * 100) / 100,
    }),
  );
  return { pages };
}

if (!existsSync(htmlPath)) {
  throw new Error(`Missing ${htmlPath} — run "npm run generate:brochure" first.`);
}

if (existsSync(previewDir)) rmSync(previewDir, { recursive: true, force: true });
mkdirSync(previewDir, { recursive: true });

const { browser, label } = await launchChromium();
console.log(`[brochure] rendering with ${label}`);
const page = await browser.newPage({ viewport: { width: 900, height: 1300 }, deviceScaleFactor: 2 });

await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

/* ──────────────────────────────────────────────────────────────────────
 * Shared browser-side helpers, injected into every `page.evaluate`.
 * Kept as one string-free object literal so Node stays dependency-free.
 * ────────────────────────────────────────────────────────────────────── */

/**
 * Injected once into the page as `window.__qa` so the individual probe
 * functions (which Playwright serialises standalone) can share helpers.
 */
function installHelpers() {
  /** @returns {string} short, readable selector for an element (tag + classes + index path). */
  const cssPath = (el) => {
    const parts = [];
    let node = el;
    while (node && node.nodeType === 1 && parts.length < 4) {
      let part = node.tagName.toLowerCase();
      if (node.id) {
        parts.unshift(`${part}#${node.id}`);
        break;
      }
      const cls = (node.getAttribute("class") ?? "").trim().split(/\s+/).filter(Boolean).slice(0, 2);
      if (cls.length) part += `.${cls.join(".")}`;
      const parent = node.parentElement;
      if (parent) {
        const sibs = [...parent.children].filter((c) => c.tagName === node.tagName);
        if (sibs.length > 1) part += `:nth-of-type(${sibs.indexOf(node) + 1})`;
      }
      parts.unshift(part);
      node = parent;
    }
    return parts.join(" > ");
  };

  /** Text-bearing leaves: a direct, non-whitespace-only text node. */
  const TEXT_SELECTOR = "h1,h2,h3,h4,p,span,li,div";
  const textElements = (root) =>
    [...root.querySelectorAll(TEXT_SELECTOR)].filter((el) => {
      if (el.closest(".glow") || el.closest(".grid-lines")) return false;
      return [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
    });

  const parseColor = (value) => {
    const m = /^rgba?\(([^)]+)\)$/.exec(String(value).trim());
    if (!m) return null;
    const parts = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return null;
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
  };

  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });

  const toHex = (c) =>
    `#${[c.r, c.g, c.b]
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0"))
      .join("")}`;

  const chan = (v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const luminance = (c) => 0.2126 * chan(c.r) + 0.7152 * chan(c.g) + 0.0722 * chan(c.b);
  const contrastRatio = (a, b) => {
    const [hi, lo] = luminance(a) > luminance(b) ? [luminance(a), luminance(b)] : [luminance(b), luminance(a)];
    return (hi + 0.05) / (lo + 0.05);
  };

  /**
   * Walk up compositing translucent backgrounds until an opaque colour is reached.
   * Gradient / image backgrounds have no single resolvable colour, so we keep walking
   * past them rather than giving up.
   */
  const effectiveBg = (el) => {
    let acc = null;
    for (let node = el; node; node = node.parentElement) {
      const cs = getComputedStyle(node);
      if (cs.backgroundImage && cs.backgroundImage !== "none") continue;
      const c = parseColor(cs.backgroundColor);
      if (!c || c.a === 0) continue;
      acc = acc ? over(acc, c) : c;
      if (c.a === 1) return acc;
    }
    return acc ?? { r: 255, g: 255, b: 255, a: 1 }; // canvas default
  };

  window.__qa = { cssPath, textElements, parseColor, over, toHex, contrastRatio, effectiveBg };
}
await page.evaluate(installHelpers);

/* ── 0. booklet geometry (6 .page elements, 99x210mm portrait DL) ── */
const EXPECT = { pages: 6, pageWmm: 99, pageHmm: 210, mmTolerance: 0.5, logoImgs: 1, qrImgs: 1, totalImgs: 2 };

const geometryProbe = () => {
  const MM = 96 / 25.4;
  const pages = [...document.querySelectorAll(".page")];
  const panels = [...document.querySelectorAll(".panel")];
  const panelsWrappers = [...document.querySelectorAll(".panels")];
  return {
    count: pages.length,
    panelCount: panels.length,
    panelsWrapperCount: panelsWrappers.length,
    pages: pages.map((el, i) => {
      const r = el.getBoundingClientRect();
      return {
        page: i + 1,
        widthMm: Math.round((r.width / MM) * 100) / 100,
        heightMm: Math.round((r.height / MM) * 100) / 100,
      };
    }),
  };
};

/* ── 1. bottom-edge overflow (run in BOTH screen and print media) ── */
const overflowProbe = () => {
  const { cssPath } = window.__qa;
  const MM = 96 / 25.4;
  return [...document.querySelectorAll(".page")].map((el, i) => {
    const box = el.getBoundingClientRect();
    const limit = box.bottom;
    // .glow / .grid-lines are decorative and intentionally bleed past the page box.
    const spills = [...el.querySelectorAll("*")]
      .filter((n) => !n.closest(".glow") && !n.classList.contains("grid-lines"))
      .map((n) => ({ n, r: n.getBoundingClientRect() }))
      .filter(({ r }) => r.height > 0 && r.bottom > limit + 1)
      .map(({ n, r }) => ({
        selector: cssPath(n),
        tag: n.tagName.toLowerCase(),
        cls: n.className?.toString().slice(0, 48) ?? "",
        overflowPx: Math.round(r.bottom - limit),
      }))
      .slice(0, 8);
    return {
      page: i + 1,
      heightMm: Math.round((box.height / MM) * 10) / 10,
      scrollOverflowPx: spills.reduce((max, s) => Math.max(max, s.overflowPx), 0),
      spills,
    };
  });
};

/* ── 2. per-page overflow (compare against each .page content box) ── */
const pageOverflowProbe = () => {
  const { cssPath } = window.__qa;
  const TOL = 1; // px
  const MM = 96 / 25.4;
  const px = (v) => parseFloat(v) || 0;

  return [...document.querySelectorAll(".page")].map((pageEl, si) => {
    const cs = getComputedStyle(pageEl);
    const r = pageEl.getBoundingClientRect();
    const box = {
      left: r.left + px(cs.borderLeftWidth) + px(cs.paddingLeft),
      top: r.top + px(cs.borderTopWidth) + px(cs.paddingTop),
      right: r.right - px(cs.borderRightWidth) - px(cs.paddingRight),
      bottom: r.bottom - px(cs.borderBottomWidth) - px(cs.paddingBottom),
    };

    const hits = [];
    for (const n of pageEl.querySelectorAll("*")) {
      if (n.closest(".glow") || n.classList.contains("grid-lines")) continue;
      const nr = n.getBoundingClientRect();
      if (nr.width <= 0 || nr.height <= 0) continue;
      const pastBottom = Math.round(nr.bottom - box.bottom);
      const pastRight = Math.round(nr.right - box.right);
      if (pastBottom <= TOL && pastRight <= TOL) continue;
      hits.push({
        n,
        selector: cssPath(n),
        pastBottom: pastBottom > TOL ? pastBottom : 0,
        pastRight: pastRight > TOL ? pastRight : 0,
      });
    }
    const leaves = hits.filter((h) => !hits.some((o) => o !== h && h.n.contains(o.n)));

    return {
      page: si + 1,
      contentBoxMm: {
        width: Math.round(((box.right - box.left) / MM) * 10) / 10,
        height: Math.round(((box.bottom - box.top) / MM) * 10) / 10,
      },
      overflowPx: Math.max(
        0,
        ...leaves.map((h) => Math.max(h.pastBottom, h.pastRight)),
      ),
      spills: leaves
        .map((h) => ({
          selector: h.selector,
          tag: h.n.tagName.toLowerCase(),
          cls: h.n.className?.toString().slice(0, 48) ?? "",
          pastBottom: h.pastBottom,
          pastRight: h.pastRight,
        }))
        .slice(0, 6),
    };
  });
};

/* ── 3. overlapping text boxes (stacked / collapsed-flex collisions) ── */
const overlapProbe = () => {
  const { cssPath, textElements } = window.__qa;
  const TOL = 1; // px
  return [...document.querySelectorAll(".page")].map((pageEl, pi) => {
    const items = textElements(pageEl)
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ r }) => r.width > 0 && r.height > 0)
      .map(({ el, r }) => ({
        el,
        selector: cssPath(el),
        left: r.left,
        top: r.top,
        right: r.right,
        bottom: r.bottom,
      }));

    const hits = [];
    for (let a = 0; a < items.length; a += 1) {
      for (let b = a + 1; b < items.length; b += 1) {
        const x = items[a];
        const y = items[b];
        if (x.el.contains(y.el) || y.el.contains(x.el)) continue;
        const dx = Math.min(x.right, y.right) - Math.max(x.left, y.left);
        const dy = Math.min(x.bottom, y.bottom) - Math.max(x.top, y.top);
        if (dx > TOL && dy > TOL) {
          hits.push({
            a: x.selector,
            b: y.selector,
            dx: Math.round(dx),
            dy: Math.round(dy),
          });
        }
      }
    }
    return { page: pi + 1, textCount: items.length, hits: hits.slice(0, 8) };
  });
};

/* ── 4. text actually clipped by an overflow:hidden box ── */
const clipProbe = () => {
  const { cssPath, textElements } = window.__qa;
  const TOL = 1;

  /** Union of the ink rects of an element's direct text nodes. */
  const inkRect = (el) => {
    const range = document.createRange();
    let box = null;
    for (const n of el.childNodes) {
      if (n.nodeType !== 3 || !n.textContent.trim()) continue;
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) {
        if (r.width <= 0 || r.height <= 0) continue;
        box = box
          ? {
              left: Math.min(box.left, r.left),
              top: Math.min(box.top, r.top),
              right: Math.max(box.right, r.right),
              bottom: Math.max(box.bottom, r.bottom),
            }
          : { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
      }
    }
    return box;
  };

  /** Nearest ancestor (or self) that actually clips, bounded by the .page frame. */
  const clipperOf = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.overflowX !== "visible" || cs.overflowY !== "visible") return n;
    }
    return null;
  };

  /** Overflow clips at the padding edge. */
  const padBox = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const px = (v) => parseFloat(v) || 0;
    return {
      left: r.left + px(cs.borderLeftWidth),
      top: r.top + px(cs.borderTopWidth),
      right: r.right - px(cs.borderRightWidth),
      bottom: r.bottom - px(cs.borderBottomWidth),
    };
  };

  return [...document.querySelectorAll(".page")].map((pageEl, pi) => {
    const clipped = [];
    const benign = [];
    for (const el of textElements(pageEl)) {
      const cs = getComputedStyle(el);
      if (cs.display.startsWith("inline") && cs.display !== "inline-block") continue;
      if (cs.visibility === "hidden" || cs.opacity === "0") continue;

      const overX = el.scrollWidth - el.clientWidth;
      const overY = el.scrollHeight - el.clientHeight;
      if (overX <= TOL && overY <= TOL) continue;

      const finding = {
        selector: cssPath(el),
        text: (el.textContent ?? "").trim().slice(0, 32),
        clientW: el.clientWidth,
        clientH: el.clientHeight,
        scrollW: el.scrollWidth,
        scrollH: el.scrollHeight,
        overX: Math.round(overX),
        overY: Math.round(overY),
      };

      const ink = inkRect(el);
      const clipper = clipperOf(el);
      const cut =
        ink &&
        clipper &&
        (ink.left < padBox(clipper).left - TOL ||
          ink.right > padBox(clipper).right + TOL ||
          ink.top < padBox(clipper).top - TOL ||
          ink.bottom > padBox(clipper).bottom + TOL);

      if (cut) {
        clipped.push({
          ...finding,
          clipper: `${clipper.tagName.toLowerCase()}.${(clipper.getAttribute("class") ?? "").split(/\s+/).join(".")}`,
          ink,
        });
      } else {
        benign.push(finding);
      }
    }
    return { page: pi + 1, clipped: clipped.slice(0, 8), benign: benign.slice(0, 8) };
  });
};

/* ── 5. WCAG contrast against the nearest resolvable background ── */
const contrastProbe = () => {
  const { cssPath, textElements, parseColor, over, toHex, contrastRatio, effectiveBg } = window.__qa;
  const findings = [];
  let skippedGradient = 0;

  const pageEls = [...document.querySelectorAll(".page")];
  for (let pi = 0; pi < pageEls.length; pi += 1) {
    for (const el of textElements(pageEls[pi])) {
      const cs = getComputedStyle(el);
      // Gradient-filled text (`-webkit-text-fill-color: transparent`) — cannot be
      // measured statically, and is intentionally invisible to a colour check.
      const fill = parseColor(cs.webkitTextFillColor || "rgba(0, 0, 0, 0)");
      if (fill && fill.a === 0) {
        skippedGradient += 1;
        continue;
      }
      const fgRaw = parseColor(cs.color);
      if (!fgRaw || fgRaw.a === 0) {
        skippedGradient += 1;
        continue;
      }
      const bg = effectiveBg(el);
      const fg = fgRaw.a < 1 ? over(fgRaw, bg) : fgRaw;
      const size = parseFloat(cs.fontSize);
      const bold = (parseInt(cs.fontWeight, 10) || 400) >= 600;
      const required = size >= 18.66 || (bold && size >= 14) ? 3 : 4.5;
      const r = contrastRatio(fg, bg);
      if (r + 0.005 < required) {
        findings.push({
          page: pi + 1,
          selector: cssPath(el),
          text: (el.textContent ?? "").trim().slice(0, 32),
          ratio: Math.round(r * 100) / 100,
          required,
          fg: toHex(fg),
          bg: toHex(bg),
          size,
        });
      }
    }
  }
  return { findings: findings.slice(0, 20), skippedGradient };
};

/* ── 6. inlined assets actually rasterise (logo + QR) ── */
const assetProbe = () => {
  const SAMPLE = 64; // px, enough to see a QR grid / logo medallion, cheap to read back
  return [...document.querySelectorAll("img")].map((img, i) => {
    const pageIndex = [...document.querySelectorAll(".page")].findIndex((s) => s.contains(img));
    const src = img.currentSrc || img.src || "";
    const isSvg = /data:image\/svg\+xml/i.test(src) || /\.svg(\?|#|$)/i.test(src);
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const finding = {
      index: i + 1,
      page: pageIndex >= 0 ? pageIndex + 1 : 0,
      kind: isSvg ? "svg" : "raster",
      selector: window.__qa.cssPath(img),
      srcPrefix: src.slice(0, 80),
      complete: img.complete,
      naturalW,
      naturalH,
      displayW: Math.round(img.getBoundingClientRect().width),
      displayH: Math.round(img.getBoundingClientRect().height),
      distinctColors: null,
      opaquePixels: null,
      sampledPixels: null,
    };

    if (!img.complete || naturalW <= 0 || naturalH <= 0) return { ...finding, ok: false, reason: "did not load (no intrinsic size)" };

    const canvas = document.createElement("canvas");
    canvas.width = Math.min(naturalW, SAMPLE);
    canvas.height = Math.min(naturalH, SAMPLE);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    try {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } catch {
      return { ...finding, ok: false, reason: "canvas drawImage threw (tainted or undecodable source)" };
    }
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const colors = new Set();
    let opaque = 0;
    for (let p = 0; p < data.length; p += 4) {
      if (data[p + 3] > 0) opaque += 1;
      colors.add(`${data[p]},${data[p + 1]},${data[p + 2]},${data[p + 3]}`);
    }
    finding.distinctColors = colors.size;
    finding.opaquePixels = opaque;
    finding.sampledPixels = canvas.width * canvas.height;
    if (opaque === 0) return { ...finding, ok: false, reason: "rasterised fully transparent" };
    if (colors.size < 2) return { ...finding, ok: false, reason: "rasterised to a single flat colour (blank)" };
    return { ...finding, ok: true, reason: "ok" };
  });
};

/* ── 7. webfont load state ── */
const fontProbe = () => {
  // Only the weights the stylesheet actually requests are shipped by Google Fonts
  // (Space Grotesk is 500/600/700 only), so check every declared face weight rather
  // than the default 400 — otherwise a correctly-loaded family looks missing.
  const wanted = ["Space Grotesk", "Inter", "JetBrains Mono"];
  return {
    status: document.fonts.status,
    loaded: wanted.map((family) => {
      const weights = [
        ...new Set(
          [...document.fonts].filter((f) => f.family === family).map((f) => f.weight),
        ),
      ];
      const probes = weights.length ? weights : [400];
      const ok = probes.some((w) => document.fonts.check(`${w} 16px "${family}"`));
      return { family, ok, weights: probes.join("/") };
    }),
  };
};

/* ── 8. HUD furniture per page (reticle + brackets, stamp, ghostnum) ── */
const furnitureProbe = () => {
  const { cssPath } = window.__qa;
  const pages = [...document.querySelectorAll(".page")];

  const coverReason = (el) => {
    const attr = el.getAttribute("data-role") ?? el.getAttribute("data-page") ?? el.getAttribute("aria-label") ?? "";
    const role = attr.trim().toLowerCase();
    if (/\b(cover|back|front)\b/.test(role)) return `role "${attr.trim()}"`;
    // Probes are serialised standalone into the page, so the token list has to live
    // inside this function — a module-level constant would be an undefined reference.
    const token = [...el.classList]
      .map((c) => c.toLowerCase())
      .find((c) => /(^|-)(cover|front|back)($|-)/.test(c));
    return token ? `.${token}` : null;
  };

  const reasons = pages.map(coverReason);
  let coverIndexes = pages.map((_, i) => (reasons[i] ? i : -1)).filter((i) => i >= 0);
  let coverMode = "class/role markup";
  // Class markup is the primary signal; in a 6-page booklet the cover is page 1, so
  // that position is the documented fallback when no page declares itself a cover.
  if (coverIndexes.length !== 1) {
    coverIndexes = coverIndexes.length ? coverIndexes : [0];
    coverMode = "booklet fallback (page 1)";
  }

  // Furniture that is display:none or zero-sized prints as nothing, so counting it as
  // present would let a stripped blueprint pass.
  const isVisible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const countVisible = (root, selector) => [...root.querySelectorAll(selector)].filter(isVisible).length;

  return {
    coverMode,
    coverPages: coverIndexes.map((i) => i + 1),
    pages: pages.map((el, i) => {
      const reticles = [...el.querySelectorAll(".reticle")];
      return {
        page: i + 1,
        cls: (el.getAttribute("class") ?? "").slice(0, 48),
        isCover: coverIndexes.includes(i),
        coverReason: reasons[i],
        stamps: countVisible(el, ".stamp"),
        ghostnums: countVisible(el, ".ghostnum"),
        reticles: reticles.map((r) => ({
          selector: cssPath(r),
          // Brackets belonging to THIS reticle, so a nested frame's corners are not
          // double-counted as the parent's.
          corners: [...r.querySelectorAll(".bracket")].filter(
            (b) => b.closest(".reticle") === r && isVisible(b),
          ).length,
          directChildren: [...r.children].filter(
            (c) => c.classList.contains("bracket") && isVisible(c),
          ).length,
          rendered: isVisible(r),
        })),
      };
    }),
  };
};

/* ── 9. technical-bullet regression guard (glyphs, not the old round dots) ── */
const bulletProbe = () => {
  const { cssPath } = window.__qa;
  const isVisible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  // Only guard lists that actually print — a display:none list contributes no ink,
  // so its ::before styling cannot be a printing regression.
  return [...document.querySelectorAll(".tick-list")]
    .filter(isVisible)
    .map((list, i) => ({
      list: i + 1,
      selector: cssPath(list),
      items: [...list.querySelectorAll("li")].map((li, j) => {
        const mark = getComputedStyle(li, "::before");
        const own = getComputedStyle(li);
        const radii = [
          mark.borderTopLeftRadius,
          mark.borderTopRightRadius,
          mark.borderBottomRightRadius,
          mark.borderBottomLeftRadius,
        ];
        const markBg = mark.backgroundImage || "";
        const ownBg = own.backgroundImage || "";
        return {
          item: j + 1,
          selector: cssPath(li),
          text: (li.textContent ?? "").trim().slice(0, 28),
          glyph: mark.content,
          roundBullet: radii.some((v) => /(^|\s)50%(\s|$)/.test(v)),
          radius: radii.join(" / "),
          markRadial: /radial-gradient|conic-gradient/.test(markBg),
          ownRadial: /radial-gradient|conic-gradient/.test(ownBg),
          background: (markBg !== "none" ? markBg : ownBg).slice(0, 44),
        };
      }),
    }));
};

/* ── 10. palette audit (every rendered colour must be on the approved list) ── */
const paletteProbe = (spec) => {
  const { cssPath, parseColor, toHex } = window.__qa;
  const allowed = new Set(spec.palette.map((h) => h.toUpperCase()));
  const white = spec.white.toUpperCase();
  const PROPS = [
    "color",
    "backgroundColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
    "outlineColor",
  ];

  const counts = new Map();
  const violations = [];

  const pageAreaOf = (el) => {
    const p = el.closest(".page");
    const r = p ? p.getBoundingClientRect() : null;
    return r && r.width > 0 && r.height > 0 ? r.width * r.height : null;
  };

  /** White is legitimate only behind the logo/QR bitmap, which is small and holds an <img>. */
  const isSwatch = (el) => {
    if (!el.querySelector("img")) return false;
    const area = pageAreaOf(el);
    if (area === null) return false;
    const r = el.getBoundingClientRect();
    return r.width * r.height <= area * spec.swatchAreaFraction;
  };

  const isLargeText = (el) => {
    const cs = getComputedStyle(el);
    const size = parseFloat(cs.fontSize);
    const bold = (parseInt(cs.fontWeight, 10) || 400) >= 600;
    return size >= 18.66 || (bold && size >= 14);
  };

  for (const el of document.body.querySelectorAll("*")) {
    const tag = el.tagName.toLowerCase();
    if (tag === "img" || tag === "svg" || el.closest("svg")) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none") continue;

    // border-*-color resolves to currentcolor even with border-width:0 and
    // outline-color to currentcolor with outline-style:none, so only count the
    // ones that can actually paint — otherwise one bad ink is reported six times.
    const live = new Set(["color", "backgroundColor"]);
    for (const side of ["top", "right", "bottom", "left"]) {
      if (parseFloat(cs[`border${side[0].toUpperCase()}${side.slice(1)}Width`]) > 0) live.add(`border${side[0].toUpperCase()}${side.slice(1)}Color`);
    }
    if (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) live.add("outlineColor");

    for (const prop of PROPS) {
      if (!live.has(prop)) continue;
      const parsed = parseColor(cs[prop]);
      if (!parsed || parsed.a === 0) continue;
      const hex = toHex(parsed).toUpperCase();
      const rec = counts.get(hex) ?? { hex, uses: 0, props: new Set(), samples: [] };
      rec.uses += 1;
      rec.props.add(prop);
      if (rec.samples.length < 3) rec.samples.push(cssPath(el));
      counts.set(hex, rec);

      if (hex === white) {
        if (prop === "backgroundColor" && isSwatch(el)) continue;
        violations.push({
          hex,
          prop,
          selector: cssPath(el),
          tag,
          cls: (el.getAttribute("class") ?? "").slice(0, 40),
          reason:
            prop === "backgroundColor"
              ? isLargeText(el) || el.matches(".page") || !el.closest(".page")
                ? "white page background — page must stay dark"
                : "white background outside a logo/QR swatch"
              : prop === "color"
                ? `white text colour${isLargeText(el) ? " on large text" : ""} — use a blueprint ink instead`
                : `white ${prop} — not permitted outside a logo/QR swatch`,
        });
        continue;
      }
      if (!allowed.has(hex)) {
        violations.push({ hex, prop, selector: cssPath(el), tag, cls: (el.getAttribute("class") ?? "").slice(0, 40), reason: "colour is not on the approved palette" });
      }
    }
  }

  return {
    distinct: [...counts.values()]
      .map((r) => ({ hex: r.hex, uses: r.uses, props: [...r.props].sort().join(","), samples: r.samples }))
      .sort((a, b) => b.uses - a.uses),
    violations: violations.slice(0, 24),
    violationCount: violations.length,
  };
};

/* ── 11. hairlines must survive the print raster ── */
const hairlineProbe = () => {
  const { cssPath } = window.__qa;
  const dpr = window.devicePixelRatio || 1;
  const minCssPx = 1 / dpr;
  const scanned = [];
  let thinnestH = Infinity;
  let thinnestW = Infinity;

  for (const el of document.querySelectorAll('.rule-line, .hr, [class*="rule"], [class*="line"]')) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.display === "contents" || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    thinnestH = Math.min(thinnestH, r.height);
    thinnestW = Math.min(thinnestW, r.width);
    scanned.push({
      selector: cssPath(el),
      tag: el.tagName.toLowerCase(),
      cls: (el.getAttribute("class") ?? "").slice(0, 40),
      w: Math.round(r.width * 100) / 100,
      h: Math.round(r.height * 100) / 100,
      tooThin: r.height < minCssPx || r.width < minCssPx,
    });
  }

  return {
    dpr,
    minCssPx: Math.round(minCssPx * 1000) / 1000,
    scannedCount: scanned.length,
    thinnestHeight: Number.isFinite(thinnestH) ? Math.round(thinnestH * 100) / 100 : null,
    thinnestWidth: Number.isFinite(thinnestW) ? Math.round(thinnestW * 100) / 100 : null,
    failures: scanned.filter((s) => s.tooThin),
    all: scanned,
  };
};

/* ──────────────────────────────────────────────────────────────────────
 * Report assembly
 * ────────────────────────────────────────────────────────────────────── */
const DESIGN = {
  reticles: EXPECT.pages,
  bracketsPerReticle: 4,
  swatchAreaFraction: 0.05,
  white: "#FFFFFF",
  palette: [
    "#05070A",
    "#0A0E14",
    "#0F141C",
    "#131A24",
    "#1B2430",
    "#2A3646",
    "#3A4859",
    "#DCE3ED",
    "#A8B3C2",
    "#7C8798",
    "#4A5464",
    "#22D3EE",
    "#7C6CFF",
    "#2E9E5B",
    "#F5C451",
  ],
};

const lines = [];
const say = (indent, tag, msg) => lines.push(`  ${indent}${tag.trim().padEnd(5)}${msg}`);
let overflowCount = 0;
let clipCount = 0;
let warnCount = 0;
let overlapCount = 0;
let geometryFailures = 0;
let pageOverflowCount = 0;
let assetFailures = 0;
let designFailures = 0;

const geometry = await page.evaluate(geometryProbe);
const screenReport = await page.evaluate(overflowProbe);
const pageReport = await page.evaluate(pageOverflowProbe);
const overlaps = await page.evaluate(overlapProbe);
const clips = await page.evaluate(clipProbe);
const contrast = await page.evaluate(contrastProbe);
const assets = await page.evaluate(assetProbe);
const fonts = await page.evaluate(fontProbe);
const furniture = await page.evaluate(furnitureProbe);
const bullets = await page.evaluate(bulletProbe);
const palette = await page.evaluate(paletteProbe, DESIGN);
const hairlines = await page.evaluate(hairlineProbe);

// The logo ships once as a raster bitmap; the QR ships once as an inline SVG. Counting
// them apart is what catches a logo repeated across pages.
const logos = assets.filter((a) => a.kind === "raster");
const qrs = assets.filter((a) => a.kind === "svg");

lines.push(`[brochure] geometry (6-page DL booklet · ${EXPECT.pageWmm}x${EXPECT.pageHmm}mm portrait · pages 1..${EXPECT.pages})`);
if (geometry.count === EXPECT.pages) {
  say("", "OK  ", `${geometry.count} .page element(s) · expected ${EXPECT.pages}`);
} else {
  geometryFailures += 1;
  say("", "FAIL", `found ${geometry.count} .page element(s) · expected ${EXPECT.pages} (DL booklet pages 1..${EXPECT.pages})`);
}
if (geometry.panelCount === 0 && geometry.panelsWrapperCount === 0) {
  say("", "OK  ", "no .panel / .panels leftovers (booklet pages are flat)");
} else {
  geometryFailures += 1;
  say(
    "",
    "FAIL",
    `stale tri-fold markup in the DOM · ${geometry.panelCount} .panel · ${geometry.panelsWrapperCount} .panels wrapper — the booklet has no panels`,
  );
}
for (const p of geometry.pages) {
  const wOk = Math.abs(p.widthMm - EXPECT.pageWmm) <= EXPECT.mmTolerance;
  const hOk = Math.abs(p.heightMm - EXPECT.pageHmm) <= EXPECT.mmTolerance;
  if (!wOk || !hOk) geometryFailures += 1;
  say(
    "",
    wOk && hOk ? "OK  " : "FAIL",
    `page ${p.page} · ${p.widthMm}x${p.heightMm}mm (want ${EXPECT.pageWmm}x${EXPECT.pageHmm}mm ±${EXPECT.mmTolerance})`,
  );
}

// Expected page numbers plus any extras the template actually rendered, so a page
// beyond 6 still has its overflow reported instead of silently escaping the loop.
const pageNumbers = [...new Set([...Array.from({ length: EXPECT.pages }, (_, i) => i + 1), ...screenReport.map((x) => x.page)])].sort(
  (a, b) => a - b,
);

for (const n of pageNumbers) {
  const p = screenReport.find((x) => x.page === n);
  const ov = overlaps.find((o) => o.page === n) ?? { textCount: 0, hits: [] };
  const cl = clips.find((c) => c.page === n) ?? { clipped: [], benign: [] };
  const pg = pageReport.find((r) => r.page === n);
  lines.push(`[brochure] page ${n}`);
  if (!p) {
    geometryFailures += 1;
    say("", "FAIL", `no .page element at position ${n} — expected DOM order 1..${EXPECT.pages}`);
    continue;
  }
  say("", "OK  ", `page bottom overflow ${p.scrollOverflowPx}px`);
  for (const s of p.spills) {
    overflowCount += 1;
    say("", "FAIL", `overflow ${s.overflowPx}px past page bottom · ${s.selector}`);
  }

  if (pg) {
    const bad = pg.overflowPx > 0;
    if (bad) pageOverflowCount += pg.spills.length;
    say(
      "",
      bad ? "FAIL" : "OK  ",
      `content box ${pg.contentBoxMm.width}x${pg.contentBoxMm.height}mm · overflow ${pg.overflowPx}px`,
    );
    for (const s of pg.spills) {
      const where = [s.pastBottom ? `bottom +${s.pastBottom}px` : null, s.pastRight ? `right +${s.pastRight}px` : null]
        .filter(Boolean)
        .join(" · ");
      say("", "FAIL", `page ${n} · past ${where} · ${s.selector}`);
    }
  }

  overlapCount += ov.hits.length;
  say("", ov.hits.length ? "WARN" : "OK  ", `text overlap · ${ov.textCount} text boxes checked · ${ov.hits.length} pair(s)`);
  for (const h of ov.hits) say("", "WARN", `overlap ${h.dx}x${h.dy}px · ${h.a} ↔ ${h.b}`);

  clipCount += cl.clipped.length;
  say("", cl.clipped.length ? "FAIL" : "OK  ", `clipped text · ${cl.clipped.length} element(s)`);
  for (const h of cl.clipped) {
    say(
      "",
      "FAIL",
      `clipped ${h.overX}x${h.overY}px · ${h.selector} · box ${h.clientW}x${h.clientH} content ${h.scrollW}x${h.scrollH} · cut by ${h.clipper} · "${h.text}"`,
    );
  }
  if (cl.benign.length) {
    say(
      "",
      "OK  ",
      `${cl.benign.length} tight-line-height ink overflow(s), not clipped: ${cl.benign
        .map((h) => `${h.selector.split(" > ").pop()} +${h.overY}px`)
        .join(", ")}`,
    );
  }
}

lines.push("[brochure] contrast (WCAG 2.1 · 4.5:1 normal / 3:1 large)");
for (const f of contrast.findings) {
  warnCount += 1;
  say("", "WARN", `page ${f.page} ${f.ratio}:1 (needs ${f.required}:1) · fg ${f.fg} on bg ${f.bg} · ${f.size}px · ${f.selector} · "${f.text}"`);
}
if (!contrast.findings.length) {
  lines.push(`  OK   all text meets its WCAG target (${contrast.skippedGradient} gradient/transparent-fill text nodes skipped)`);
}

lines.push(`[brochure] assets (${assets.length} inlined <img> · ${logos.length} logo + ${qrs.length} QR expected once each)`);
if (!assets.length) {
  assetFailures += 1;
  say("", "FAIL", "no <img> found — the logo and QR are expected to be inlined as data URIs");
}
for (const a of assets) {
  const kind = a.kind;
  if (a.ok) {
    say(
      "",
      "OK  ",
      `img ${a.index} · ${kind} · page ${a.page || "outside any .page"} · ${a.naturalW}x${a.naturalH} natural · ${a.displayW}x${a.displayH} rendered · ${a.distinctColors} colours, ${a.opaquePixels}/${a.sampledPixels}px opaque · ${a.srcPrefix}…`,
    );
  } else {
    assetFailures += 1;
    say("", "FAIL", `img ${a.index} · ${kind} · page ${a.page || "outside any .page"} · ${a.reason} · natural ${a.naturalW}x${a.naturalH} · ${a.srcPrefix || "(no src)"}`);
  }
}

const logoOk = logos.length === EXPECT.logoImgs;
const qrOk = qrs.length === EXPECT.qrImgs;
const totalOk = assets.length === EXPECT.totalImgs;
if (logoOk) {
  say("", "OK  ", `${logos.length} logo <img> · expected exactly ${EXPECT.logoImgs} (once-only, page 1 cover)`);
} else {
  assetFailures += 1;
  const pages = logos.map((l) => l.page || "?").join(", ");
  say(
    "",
    "FAIL",
    `${logos.length} raster logo <img> · expected exactly ${EXPECT.logoImgs} — the logo must appear once, on the page 1 cover (found on page: ${pages || "none"})`,
  );
}
if (qrOk) {
  say("", "OK  ", `${qrs.length} SVG QR <img> · expected exactly ${EXPECT.qrImgs}`);
} else {
  assetFailures += 1;
  say("", "FAIL", `${qrs.length} SVG QR <img> · expected exactly ${EXPECT.qrImgs} (once, on the last page)`);
}
if (totalOk) {
  say("", "OK  ", `${assets.length} <img> total · expected ${EXPECT.totalImgs}`);
} else {
  assetFailures += 1;
  say("", "FAIL", `${assets.length} <img> total · expected ${EXPECT.totalImgs} (1 logo + 1 QR) — ${assets.length - EXPECT.totalImgs >= 0 ? "extra" : "missing"} asset(s)`);
}

lines.push("[brochure] webfonts");
for (const f of fonts.loaded) {
  if (f.ok) say("", "OK  ", `${f.family} loaded`);
  else {
    warnCount += 1;
    say("", "WARN", `${f.family} not loaded — falling back to system fonts`);
  }
}
say("", "OK  ", `document.fonts.status = ${fonts.status}`);

lines.push("[brochure] design system (HUD furniture · glyph bullets · palette · hairlines)");

const furnitureFailures = [];
let reticleTotal = 0;
for (const p of furniture.pages) {
  const active = p.reticles.filter((r) => r.rendered);
  reticleTotal += active.length;
  const where = `page ${p.page}${p.cls ? ` (.${p.cls.split(/\s+/).join(".")})` : ""}`;
  const coverNote = p.isCover ? ` · cover (${p.coverReason ?? "page 1"}) — counts informational` : "";

  const badgeOk = active.length >= 1 && active.every((r) => r.corners === DESIGN.bracketsPerReticle);
  if (!active.length) furnitureFailures.push(`${where} · no rendered .reticle HUD frame (want >= 1 per page)`);
  for (const r of active) {
    if (r.corners !== DESIGN.bracketsPerReticle) {
      furnitureFailures.push(`${where} · .reticle ${r.selector} has ${r.corners} visible .bracket (want exactly ${DESIGN.bracketsPerReticle} corners)`);
    }
  }
  if (!p.isCover) {
    if (p.stamps < 1) furnitureFailures.push(`${where} · no visible .stamp micro-label`);
    if (p.ghostnums < 1) furnitureFailures.push(`${where} · no visible .ghostnum index watermark`);
  }
  const badge = active
    .map((r) => `${r.corners}/${DESIGN.bracketsPerReticle}${r.directChildren === r.corners ? "" : ` (${r.directChildren} direct)`}`)
    .join(" ");
  say(
    "",
    badgeOk ? "OK  " : "FAIL",
    `${where} · reticle ${active.length} · brackets ${badge || `none (want ${DESIGN.bracketsPerReticle})`} · .stamp ${p.stamps} · .ghostnum ${p.ghostnums}${coverNote}`,
  );
}
if (reticleTotal !== DESIGN.reticles) {
  furnitureFailures.push(`found ${reticleTotal} .reticle across all pages · expected ${DESIGN.reticles} (one per page)`);
}
say(
  "",
  reticleTotal === DESIGN.reticles ? "OK  " : "FAIL",
  `reticle total ${reticleTotal} · expected ${DESIGN.reticles} · cover detection via ${furniture.coverMode} → pages ${furniture.coverPages.join(", ") || "none"}`,
);
for (const f of furnitureFailures) {
  designFailures += 1;
  say("", "FAIL", f);
}

const bulletItems = bullets.flatMap((l) => l.items);
if (!bullets.length) {
  designFailures += 1;
  say("", "FAIL", `no .tick-list found — technical bullet lists are part of the blueprint system`);
} else {
  say(
    "",
    "OK  ",
    `${bullets.length} .tick-list(s) · ${bulletItems.length} li · glyph bullets ${[...new Set(bulletItems.map((i) => i.glyph))].join(" ") || "(none)"}`,
  );
}
for (const l of bullets) {
  for (const it of l.items) {
    if (it.roundBullet) {
      designFailures += 1;
      say("", "FAIL", `${it.selector} · ::before border-radius ${it.radius} — circular dot bullet, blueprint requires a +/▸ glyph`);
    }
    if (it.markRadial || it.ownRadial) {
      designFailures += 1;
      say("", "FAIL", `${it.selector} · radial/circular gradient bullet background "${it.background}" — blueprint requires a glyph bullet`);
    }
  }
}

lines.push(`  OK   palette · ${palette.distinct.length} distinct colour(s) in use`);
for (const c of palette.distinct) say("", "OK  ", `${c.hex} · ${c.uses} use(s) · ${c.props} · e.g. ${c.samples[0] ?? "?"}`);
for (const v of palette.violations) {
  designFailures += 1;
  say("", "FAIL", `${v.hex} as ${v.prop} · ${v.reason} · ${v.selector}`);
}
if (palette.violationCount > palette.violations.length) {
  say("", "FAIL", `… and ${palette.violationCount - palette.violations.length} further off-palette colour(s)`);
  designFailures += palette.violationCount - palette.violations.length;
}

if (!hairlines.scannedCount) {
  designFailures += 1;
  say("", "FAIL", `no rule/divider element matched .rule-line, .hr, [class*="rule"], [class*="line"]`);
} else {
  say(
    "",
    "OK  ",
    `hairlines · ${hairlines.scannedCount} rule/divider element(s) · thinnest ${hairlines.thinnestHeight}px h / ${hairlines.thinnestWidth}px w · floor ${hairlines.minCssPx}px css (= 1 device px @ ${hairlines.dpr}x)`,
  );
}
for (const h of hairlines.failures) {
  designFailures += 1;
  say("", "FAIL", `${h.selector} · renders ${h.w}x${h.h}px — below 1 device px, will disappear in print`);
}

console.log(lines.join("\n"));

/* ── screenshots (screen media, before the print simulation) ── */
const pageCount = await page.locator(".page").count();
for (let i = 0; i < pageCount; i += 1) {
  await page.locator(".page").nth(i).screenshot({ path: join(previewDir, `page-${i + 1}.png`) });
}

/* ── print-media overflow re-check ── */
await page.emulateMedia({ media: "print" });
await page.waitForTimeout(200);
const printReport = await page.evaluate(overflowProbe);
const printPages = await page.evaluate(pageOverflowProbe);
console.log("[brochure] print-media overflow re-check (@media print strips box-shadow + margin)");
const screenKeys = new Map(
  screenReport.map((p) => [p.page, new Set([...p.spills.map((s) => `${s.selector}:${s.overflowPx}`)])]),
);
for (const p of printReport) {
  const known = screenKeys.get(p.page) ?? new Set();
  const printOnly = p.spills.filter((s) => !known.has(`${s.selector}:${s.overflowPx}`));
  const status = p.scrollOverflowPx > 0 ? "FAIL" : "OK  ";
  if (p.scrollOverflowPx > 0) overflowCount += p.spills.length;
  console.log(`  ${status} page ${p.page}  height ${p.heightMm}mm  print overflow ${p.scrollOverflowPx}px`);
  for (const s of p.spills) {
    const tag = printOnly.some((o) => o.selector === s.selector) ? "print-only" : "also on screen";
    console.log(`        overflow ${s.overflowPx}px  (${tag})  <${s.tag} class="${s.cls}">`);
  }
}
const screenPageKeys = new Map(
  pageReport.map((r) => [r.page, new Set(r.spills.map((s) => `${s.selector}:${s.pastBottom}:${s.pastRight}`))]),
);
for (const r of printPages) {
  const known = screenPageKeys.get(r.page) ?? new Set();
  const fresh = r.spills.filter((s) => !known.has(`${s.selector}:${s.pastBottom}:${s.pastRight}`));
  if (r.overflowPx > 0) pageOverflowCount += fresh.length;
  console.log(
    `  ${r.overflowPx > 0 ? "FAIL" : "OK  "} page ${r.page}  content box ${r.contentBoxMm.width}x${r.contentBoxMm.height}mm  print overflow ${r.overflowPx}px${r.overflowPx > 0 && !fresh.length ? " (already counted on screen)" : ""}`,
  );
  for (const s of r.spills) {
    const tag = fresh.some((o) => o.selector === s.selector) ? "print-only" : "also on screen";
    console.log(`        past bottom +${s.pastBottom}px / right +${s.pastRight}px  (${tag})  <${s.tag} class="${s.cls}">`);
  }
}
await page.emulateMedia({ media: null });

// No `format` and no `landscape` on purpose: `preferCSSPageSize` makes Playwright take
// the page box from the template's `@page { size: 99mm 210mm; margin: 0 }`. Adding
// `format` (which carries its own orientation) could silently override that rule, so the
// PDF's MediaBox is measured afterwards instead of being trusted.
await page.pdf({
  path: pdfPath,
  printBackground: true,
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
  preferCSSPageSize: true,
});
console.log(`[brochure] ${pdfPath}`);

const pdfBoxes = inspectPdf(readFileSync(pdfPath).toString("latin1"));
if (!pdfBoxes.pages.length) {
  geometryFailures += 1;
  console.log("  FAIL pdf page size could not be read (no /MediaBox found) — orientation unverified");
}
if (pdfBoxes.pages.length !== EXPECT.pages) {
  geometryFailures += 1;
  console.log(`  FAIL pdf has ${pdfBoxes.pages.length} page(s) · expected ${EXPECT.pages} (one per .page)`);
}
pdfBoxes.pages.forEach((box, i) => {
  const portrait = box.heightMm > box.widthMm;
  const sized = Math.abs(box.widthMm - EXPECT.pageWmm) <= 1 && Math.abs(box.heightMm - EXPECT.pageHmm) <= 1;
  if (!portrait || !sized) geometryFailures += 1;
  console.log(
    `  ${portrait && sized ? "OK  " : "FAIL"} pdf page ${i + 1}  ${box.widthMm}x${box.heightMm}mm  ${portrait ? "portrait" : "LANDSCAPE"}${sized ? "" : ` (expected ${EXPECT.pageWmm}x${EXPECT.pageHmm}mm)`}`,
  );
});

await browser.close();

const shots = readdirSync(previewDir).sort();
console.log(`[brochure] previews: ${shots.length} page(s) in ${previewDir}`);

const warningTotal = warnCount + overlapCount;
console.log(
  `[brochure] ${pageCount} page(s) · ${overflowCount} page overflow · ${pageOverflowCount} page content-box overflow · ${clipCount} clipped · ${geometryFailures} geometry · ${assetFailures} asset · ${designFailures} design · ${warningTotal} warnings`,
);
if (overflowCount > 0 || clipCount > 0 || pageOverflowCount > 0 || geometryFailures > 0 || assetFailures > 0 || designFailures > 0) {
  console.log("[brochure] FAIL — geometry, overflow, clipped text, wrong logo/asset count, or design system violation detected");
  process.exit(1);
}
console.log("[brochure] PASS — no overflow, no clipped text, design system clean");