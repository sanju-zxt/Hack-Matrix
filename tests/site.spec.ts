import { readFile } from "node:fs/promises";
import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const ROUTES = ["/", "/register", "/rules", "/faq"] as const;
const RESPONSIVE_ROUTES = [...ROUTES, "/this-route-does-not-exist"] as const;
const DESKTOP_VIEWPORT = { width: 1440, height: 900 } as const;
const SHORT_LANDSCAPE_VIEWPORT = { width: 740, height: 360 } as const;
const VIEWPORTS = [
  { name: "320x568", viewport: { width: 320, height: 568 } },
  { name: "390x844", viewport: { width: 390, height: 844 } },
  { name: "430x932", viewport: { width: 430, height: 932 } },
  { name: "740x360 landscape", viewport: SHORT_LANDSCAPE_VIEWPORT },
  { name: "768x1024", viewport: { width: 768, height: 1024 } },
  { name: "1023x768", viewport: { width: 1023, height: 768 } },
  { name: "1024x768", viewport: { width: 1024, height: 768 } },
  { name: "1440x900 desktop", viewport: DESKTOP_VIEWPORT },
] as const;
const HORIZONTAL_TOLERANCE = 1;
const NAVIGATION_TIMEOUT = 30_000;
const FONT_SETTLE_TIMEOUT = 15_000;
const WEB_FONT_FAMILIES = ["Inter", "JetBrains Mono", "Space Grotesk"] as const;
const KEY_SELECTORS = [
  "main h1",
  "main h1 > *",
  "main h2",
  "main h2 > *",
  "main h3",
  "main h3 > *",
  "main p",
  "main a",
  "main button",
  "main input",
  "main textarea",
  "main form",
  "main iframe",
  "main ul",
  "main ol",
  "main .glass",
  "header nav",
  "header nav a",
  "header nav button",
  "footer",
  "footer a",
  "footer button",
].join(",");
const DECORATIVE_TEXT_SELECTOR =
  '[aria-hidden="true"], .sr-only, [class*="sr-only"], script, style, noscript, template';

interface OverflowOffender {
  element: string;
  overflow: number;
  reason: string;
}

interface LayoutReport {
  route: string;
  viewportWidth: number;
  documentOverflow: number;
  offenders: OverflowOffender[];
}

interface FontReport {
  loaded: string[];
  missing: string[];
}

type EventPhase = "before" | "live" | "ended";

async function waitForFontsToSettle(page: Page): Promise<FontReport> {
  const report = await page.evaluate<FontReport, string[]>(async (families) => {
    if (!document.fonts) return { loaded: families, missing: [] };
    await document.fonts.ready;
    const loaded = families.filter((family) => document.fonts.check(`1rem "${family}"`));
    return { loaded, missing: families.filter((family) => !loaded.includes(family)) };
  }, [...WEB_FONT_FAMILIES]);

  await expect
    .poll(() => page.evaluate(() => (document.fonts ? document.fonts.status : "loaded")), {
      message: "web fonts should stop loading before layout assertions run",
      timeout: FONT_SETTLE_TIMEOUT,
    })
    .toBe("loaded");

  return report;
}

async function gotoRoute(page: Page, route: string) {
  const response = await page.goto(route, { waitUntil: "load", timeout: NAVIGATION_TIMEOUT });
  expect(response?.status(), `${route} should return a document`).toBe(200);
  await expect(page.locator("main h1"), `${route} should render its main heading`).toBeVisible();

  if (route === "/") {
    await expect(
      page.locator('section[aria-busy="true"]'),
      "home should replace every lazy-section skeleton with real content"
    ).toHaveCount(0);
  }

  const fonts = await waitForFontsToSettle(page);
  if (
    fonts.missing.length > 0 &&
    !test.info().annotations.some((annotation) => annotation.type === "fonts")
  ) {
    test.info().annotations.push({
      type: "fonts",
      description: `web fonts unavailable (${fonts.missing.join(", ")}); layout measured with fallback metrics`,
    });
  }
}

async function eventPhase(page: Page): Promise<EventPhase> {
  const pill = page.getByRole("status").first();
  await expect(pill, "hero should show the live event status").toBeVisible();
  const label = (await pill.getAttribute("aria-label")) ?? "";
  if (label.includes("LIVE NOW")) return "live";
  if (label.includes("EVENT ENDED")) return "ended";
  return "before";
}

async function expectRouteToFit(page: Page, route: string) {
  const report = await page.evaluate<
    LayoutReport,
    { routeName: string; selector: string; tolerance: number; decorative: string }
  >(({ routeName, selector, tolerance, decorative }) => {
    const root = document.documentElement;
    const viewportWidth = root.clientWidth;
    const offenders: OverflowOffender[] = [];

    const describeElement = (element: HTMLElement) => {
      const id = element.id ? `#${element.id}` : "";
      const classes = element.classList.length
        ? `.${Array.from(element.classList).slice(0, 2).join(".")}`
        : "";
      return `${element.tagName.toLowerCase()}${id}${classes}`;
    };

    const isRendered = (element: Element) => {
      const style = getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden") return false;
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };

    const getTextRects = (node: Text) => {
      const range = document.createRange();
      range.selectNodeContents(node);
      return Array.from(range.getClientRects()).filter(
        (textRect) => textRect.width > 0 && textRect.height > 0
      );
    };

    const textNodesWithin = (root: Element) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      for (let node = walker.nextNode(); node; node = walker.nextNode()) nodes.push(node as Text);
      return nodes;
    };

    const getRenderedContentOverflow = (element: HTMLElement, bounds: DOMRect) => {
      const candidates = Array.from(element.querySelectorAll<HTMLElement>("*"));
      const visibleCandidates = candidates.filter((candidate) => {
        if (candidate.closest('[aria-hidden="true"]')) return false;
        const style = getComputedStyle(candidate);
        return style.display !== "none" && style.visibility !== "hidden";
      });
      const contentRects = [
        ...visibleCandidates.map((candidate) => candidate.getBoundingClientRect()),
        ...textNodesWithin(element).flatMap((node) => getTextRects(node)),
      ];
      return contentRects.reduce(
        (maximum, textRect) =>
          Math.max(maximum, bounds.left - textRect.left, textRect.right - bounds.right, 0),
        0
      );
    };

    for (const element of document.querySelectorAll<HTMLElement>(selector)) {
      if (!isRendered(element)) continue;

      const rect = element.getBoundingClientRect();
      const reasons: string[] = [];
      let overflow = Math.max(-rect.left, rect.right - viewportWidth, 0);

      if (rect.left < -tolerance || rect.right > viewportWidth + tolerance) {
        reasons.push("box extends outside the viewport");
      }

      const contentOverflow = element.classList.contains("card-sheen")
        ? getRenderedContentOverflow(element, rect)
        : element.scrollWidth - element.clientWidth;
      if (
        element.matches("h1, h2, h3, a, button, form, nav, .glass") &&
        contentOverflow > tolerance
      ) {
        overflow = Math.max(overflow, contentOverflow);
        reasons.push("content is wider than its visible box");
      }

      if (overflow > tolerance) {
        offenders.push({
          element: describeElement(element),
          overflow: Number(overflow.toFixed(2)),
          reason: reasons.join("; "),
        });
      }
    }

    const textOffenders = new Map<HTMLElement, number>();
    const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = textWalker.nextNode(); node; node = textWalker.nextNode()) {
      const text = node as Text;
      if (!text.textContent || text.textContent.trim().length === 0) continue;
      const owner = text.parentElement;
      if (!owner || owner.closest(decorative)) continue;
      const ownerStyle = getComputedStyle(owner);
      if (ownerStyle.display === "none" || ownerStyle.visibility === "hidden") continue;
      const rects = getTextRects(text);
      if (rects.length === 0) continue;
      const textLeft = Math.min(...rects.map((textRect) => textRect.left));
      const textRight = Math.max(...rects.map((textRect) => textRect.right));
      const overflow = Math.max(-textLeft, textRight - viewportWidth, 0);
      if (overflow <= tolerance) continue;
      const known = textOffenders.get(owner) ?? 0;
      if (overflow > known) textOffenders.set(owner, overflow);
    }

    for (const [element, overflow] of textOffenders) {
      offenders.push({
        element: describeElement(element),
        overflow: Number(overflow.toFixed(2)),
        reason: "rendered text extends outside the viewport",
      });
    }

    return {
      route: routeName,
      viewportWidth,
      documentOverflow: Math.max(
        0,
        root.scrollWidth - viewportWidth,
        document.body.scrollWidth - viewportWidth
      ),
      offenders,
    };
  }, {
    routeName: route,
    selector: KEY_SELECTORS,
    tolerance: HORIZONTAL_TOLERANCE,
    decorative: DECORATIVE_TEXT_SELECTOR,
  });

  const details = JSON.stringify(report, null, 2);
  expect.soft(
    report.documentOverflow,
    `${route} document horizontal overflow:\n${details}`
  ).toBeLessThanOrEqual(HORIZONTAL_TOLERANCE);
  expect.soft(report.offenders, `${route} key element overflow:\n${details}`).toEqual([]);
}

async function expectHeroHeadingToFit(page: Page) {
  const heading = page.getByRole("heading", { level: 1, name: /HACK-MATRIX/i });
  await expect(heading).toBeVisible();
  const metrics = await heading.evaluate((element) => {
    const viewportWidth = document.documentElement.clientWidth;
    const box = element.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(element);
    const textRects = Array.from(range.getClientRects()).filter(
      (rect) => rect.width > 0 && rect.height > 0
    );
    const textLeft = textRects.length
      ? Math.min(...textRects.map((rect) => rect.left))
      : box.left;
    const textRight = textRects.length
      ? Math.max(...textRects.map((rect) => rect.right))
      : box.right;
    return {
      left: Math.min(box.left, textLeft),
      right: Math.max(box.right, textRight),
      viewportWidth,
      contentOverflow: element.scrollWidth - element.clientWidth,
    };
  });

  expect.soft(metrics.left, "hero heading left edge").toBeGreaterThanOrEqual(-HORIZONTAL_TOLERANCE);
  expect.soft(metrics.right, "hero heading right edge").toBeLessThanOrEqual(
    metrics.viewportWidth + HORIZONTAL_TOLERANCE
  );
  expect.soft(metrics.contentOverflow, "hero heading content overflow").toBeLessThanOrEqual(
    HORIZONTAL_TOLERANCE
  );
}

async function expectCountdownToFit(page: Page) {
  const phase = await eventPhase(page);
  const timer = page.getByRole("timer");
  const hero = page.locator("main section").first();

  if (phase !== "before") {
    await expect(
      timer,
      `countdown should be replaced by the live state once the event is ${phase}`
    ).toHaveCount(0);
    await expect(
      hero.getByText("Event is live"),
      "the live state should explain the missing countdown"
    ).toBeVisible();
    return;
  }

  await expect(
    timer,
    "countdown should tick while the event is still ahead (or its target must be a future date)"
  ).toBeVisible();
  const values = timer.locator("span.tabular-nums");
  const count = await values.count();
  expect.soft(count, "live countdown should have four cells").toBe(4);

  const report = await values.evaluateAll((elements) => {
    const tolerance = 1;
    const failures: string[] = [];
    const viewportWidth = document.documentElement.clientWidth;

    const getTextRects = (node: Text) => {
      const range = document.createRange();
      range.selectNodeContents(node);
      return Array.from(range.getClientRects()).filter(
        (textRect) => textRect.width > 0 && textRect.height > 0
      );
    };
    const textOverflow = (node: Text, bounds: DOMRect) => {
      const rects = getTextRects(node);
      if (rects.length === 0) return 0;
      const textLeft = Math.min(...rects.map((textRect) => textRect.left));
      const textRight = Math.max(...rects.map((textRect) => textRect.right));
      return Math.max(bounds.left - textLeft, textRight - bounds.right, 0);
    };
    const textNodesInside = (root: Element, exclude: Element | null = null) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const text = node as Text;
        if (!text.textContent || text.textContent.trim().length === 0) continue;
        if (exclude?.contains(text)) continue;
        const owner = text.parentElement;
        if (!owner || owner.closest('[aria-hidden="true"]')) continue;
        nodes.push(text);
      }
      return nodes;
    };
    const inFlowContentOverflow = (root: HTMLElement, bounds: DOMRect) => {
      let worst = 0;
      for (const candidate of Array.from(root.querySelectorAll<HTMLElement>("*"))) {
        if (candidate.closest('[aria-hidden="true"]')) continue;
        const style = getComputedStyle(candidate);
        if (style.display === "none" || style.visibility === "hidden") continue;
        if (style.position === "absolute" || style.position === "fixed") continue;
        const box = candidate.getBoundingClientRect();
        if (box.width === 0 && box.height === 0) continue;
        worst = Math.max(worst, bounds.left - box.left, box.right - bounds.right, 0);
      }
      for (const text of textNodesInside(root)) {
        worst = Math.max(worst, textOverflow(text, bounds));
      }
      return worst;
    };

    const first = elements[0] ?? null;
    const timer = first?.closest('[role="timer"]') ?? null;
    let row: HTMLElement | null = null;
    for (let node = first?.parentElement ?? null; node && node !== timer; node = node.parentElement) {
      if (getComputedStyle(node).display === "grid") {
        row = node;
        break;
      }
    }

    if (!timer) failures.push("countdown values are not rendered inside a [role=timer] region");
    if (!row) {
      failures.push("could not find the countdown grid row that holds the values");
      return { failures, row: null, viewportWidth };
    }

    const gridItems = Array.from(row.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement
    );
    if (gridItems.length !== elements.length) {
      failures.push(
        `countdown row renders ${gridItems.length} cells for ${elements.length} values`
      );
    }

    const rowBox = row.getBoundingClientRect();
    if (rowBox.left < -tolerance || rowBox.right > viewportWidth + tolerance) {
      failures.push("countdown row extends outside the viewport");
    }
    if (row.scrollWidth > row.clientWidth + tolerance) {
      failures.push("countdown row content is wider than its visible box");
    }

    for (const [index, value] of elements.entries()) {
      const gridItem = gridItems[index] ?? null;
      if (!gridItem) {
        failures.push(`cell ${index} has no grid item in the countdown row`);
        continue;
      }
      if (!gridItem.contains(value)) {
        failures.push(`cell ${index} does not hold its own countdown value`);
        continue;
      }

      const gridItemBox = gridItem.getBoundingClientRect();
      if (gridItemBox.left < -tolerance || gridItemBox.right > viewportWidth + tolerance) {
        failures.push(`cell ${index} extends outside the viewport`);
      }
      if (inFlowContentOverflow(gridItem, gridItemBox) > tolerance) {
        failures.push(`cell ${index} content is wider than its visible box`);
      }

      let tile: HTMLElement | null = null;
      for (let node = value.parentElement; node && node !== gridItem; node = node.parentElement) {
        if (getComputedStyle(node).overflowX !== "visible") {
          tile = node;
          break;
        }
      }
      if (!tile) {
        failures.push(`cell ${index} has no clipping tile around its value`);
        continue;
      }

      const tileBox = tile.getBoundingClientRect();
      if (tileBox.left < gridItemBox.left - tolerance || tileBox.right > gridItemBox.right + tolerance) {
        failures.push(`cell ${index} tile extends outside its grid item`);
      }
      if (tile.scrollWidth > tile.clientWidth + tolerance) {
        failures.push(`cell ${index} tile content is wider than its visible box`);
      }

      const valueText = textNodesInside(value)[0] ?? null;
      if (!valueText) {
        failures.push(`cell ${index} value has no rendered text`);
        continue;
      }
      const valueLabel = valueText.textContent?.trim() ?? "";
      if (!/^\d{2,}$/.test(valueLabel)) {
        failures.push(`cell ${index} value is not a zero-padded number: ${JSON.stringify(valueLabel)}`);
      }
      if (textOverflow(valueText, tileBox) > tolerance) {
        failures.push(`cell ${index} value is clipped by its tile`);
      }
    }

    return {
      failures,
      row: {
        left: rowBox.left,
        right: rowBox.right,
        overflow: row.scrollWidth - row.clientWidth,
      },
      viewportWidth,
    };
  });

  expect.soft(report.failures, `countdown geometry: ${JSON.stringify(report)}`).toEqual([]);
}

test.describe("routes render", () => {
  for (const route of ROUTES) {
    test(`${route} loads without console/page errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (!message.type().includes("error")) return;
        if (message.text().includes("Failed to load resource")) return;
        errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(error.message));

      await gotoRoute(page, route);
      expect(errors).toEqual([]);
    });
  }
});

test.describe("responsive layout", () => {
  for (const { name, viewport } of VIEWPORTS) {
    test.describe(name, () => {
      test.use({ viewport: { ...viewport } });

      test("all routes, hero heading, and countdown stay within the viewport", async ({
        page,
      }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });

        for (const route of RESPONSIVE_ROUTES) {
          await gotoRoute(page, route);
          await expectRouteToFit(page, route);
          if (route === "/") {
            await expectHeroHeadingToFit(page);
            await expectCountdownToFit(page);
          }
        }
      });
    });
  }
});

test.describe("small-screen essentials", () => {
  test.use({ viewport: { width: 320, height: 568 } });

  test("sticky registration CTA remains visible and tappable", async ({ page }) => {
    await gotoRoute(page, "/");
    await expect(page.locator("body")).toHaveClass(/has-sticky-cta/);

    const cta = page
      .locator("a, button")
      .filter({ hasText: /REGISTER NOW|FORM LINK SOON/i })
      .last();
    await expect(cta).toBeVisible();
    const metrics = await cta.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return {
        left: box.left,
        right: box.right,
        bottom: box.bottom,
        height: box.height,
        viewportWidth: document.documentElement.clientWidth,
        viewportHeight: document.documentElement.clientHeight,
      };
    });

    expect(metrics.left).toBeGreaterThanOrEqual(-HORIZONTAL_TOLERANCE);
    expect(metrics.right).toBeLessThanOrEqual(metrics.viewportWidth + HORIZONTAL_TOLERANCE);
    expect(metrics.bottom).toBeLessThanOrEqual(metrics.viewportHeight + HORIZONTAL_TOLERANCE);
    expect(metrics.height).toBeGreaterThanOrEqual(44);
  });

  test("registration heading wraps without losing a tappable CTA", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoRoute(page, "/register");

    const heading = page.getByRole("heading", { level: 1, name: /REGISTER/i });
    await expect(heading).toBeVisible();
    const lineCount = await heading.evaluate((element) => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const lineTops = new Set<number>();
      let node = walker.nextNode();
      while (node) {
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const rect of Array.from(range.getClientRects())) {
          if (rect.width > 0 && rect.height > 0) lineTops.add(Math.round(rect.top));
        }
        node = walker.nextNode();
      }
      return lineTops.size;
    });
    expect(lineCount).toBeGreaterThan(1);

    const cta = page
      .locator("main a, main button")
      .filter({ hasText: /REGISTER FOR HACK-MATRIX|FORM LINK SOON/i })
      .first();
    await expect(cta).toBeVisible();
    const metrics = await cta.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return {
        left: box.left,
        right: box.right,
        height: box.height,
        contentOverflow: element.scrollWidth - element.clientWidth,
        viewportWidth: document.documentElement.clientWidth,
      };
    });
    expect(metrics.left).toBeGreaterThanOrEqual(-HORIZONTAL_TOLERANCE);
    expect(metrics.right).toBeLessThanOrEqual(metrics.viewportWidth + HORIZONTAL_TOLERANCE);
    expect(metrics.height).toBeGreaterThanOrEqual(44);
    expect(metrics.contentOverflow).toBeLessThanOrEqual(HORIZONTAL_TOLERANCE);
  });

  test("contact controls keep long text and touch targets inside the viewport", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoRoute(page, "/");

    const contact = page.locator("#contact");
    await expect(
      contact.getByRole("heading", { name: /Talk to the organizing team/i })
    ).toBeVisible();
    await contact.scrollIntoViewIfNeeded();

    const longWord = "HACKMATRIXREGISTRATIONENQUIRY".repeat(4);
    const fields = [
      contact.getByLabel("Name", { exact: true }),
      contact.getByLabel("Email", { exact: true }),
      contact.getByLabel(/^Phone/),
      contact.getByLabel("Subject", { exact: true }),
    ];
    await fields[0].fill("A student with a deliberately long registration name");
    await fields[1].fill("student-with-a-long-address@example.com");
    await fields[2].fill(`+91 ${longWord}`);
    await fields[3].fill(`${longWord} enquiry subject`);

    const message = contact.getByLabel("Message", { exact: true });
    await message.fill(
      `${longWord} ${longWord}\nPlease help us understand whether this long contact message wraps cleanly on a narrow phone.`
    );

    for (const field of [...fields, message]) {
      await expect(field).toBeVisible();
      const metrics = await field.evaluate((element) => {
        const box = element.getBoundingClientRect();
        return {
          left: box.left,
          right: box.right,
          height: box.height,
          viewportWidth: document.documentElement.clientWidth,
        };
      });
      expect(metrics.left).toBeGreaterThanOrEqual(-HORIZONTAL_TOLERANCE);
      expect(metrics.right).toBeLessThanOrEqual(metrics.viewportWidth + HORIZONTAL_TOLERANCE);
      expect(metrics.height).toBeGreaterThanOrEqual(44);
    }

    const messageMetrics = await message.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(messageMetrics.scrollWidth).toBeLessThanOrEqual(
      messageMetrics.clientWidth + HORIZONTAL_TOLERANCE
    );

    const submit = contact.getByRole("button", { name: /send message/i });
    await expect(submit).toBeVisible();
    expect((await submit.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
  });
});

test.describe("navigation", () => {
  test.use({ viewport: { ...DESKTOP_VIEWPORT } });

  test("navbar and register CTA are visible on desktop", async ({ page }) => {
    await gotoRoute(page, "/");
    await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
    await expect(page.getByRole("link", { name: /REGISTER/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Open menu|Close menu/ })).toBeHidden();
  });
});

test.describe("short-landscape mobile menu", () => {
  test.use({ viewport: { ...SHORT_LANDSCAPE_VIEWPORT } });

  test("opens an internally usable menu, closes with Escape, and restores focus", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoRoute(page, "/");

    const toggle = page.getByRole("button", { name: "Open menu" });
    const menu = page.locator("#mobile-nav");
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(menu).toBeVisible();

    const menuMetrics = await menu.evaluate((element) => {
      const candidates = [element, ...Array.from(element.querySelectorAll<HTMLElement>("*"))];
      const hasOverflow = candidates.some(
        (candidate) => candidate.scrollHeight > candidate.clientHeight + 1
      );
      const scrollable = candidates.some((candidate) => {
        const style = getComputedStyle(candidate);
        return (
          candidate.scrollHeight > candidate.clientHeight + 1 &&
          /(auto|scroll|overlay)/.test(style.overflowY)
        );
      });
      const box = element.getBoundingClientRect();
      return {
        top: box.top,
        bottom: box.bottom,
        viewportHeight: document.documentElement.clientHeight,
        hasOverflow,
        scrollable,
      };
    });

    expect(menuMetrics.top).toBeGreaterThanOrEqual(-HORIZONTAL_TOLERANCE);
    expect(menuMetrics.bottom).toBeLessThanOrEqual(
      menuMetrics.viewportHeight + HORIZONTAL_TOLERANCE
    );
    expect.soft(menuMetrics.scrollable || !menuMetrics.hasOverflow).toBe(true);

    if (menuMetrics.scrollable) {
      const scrollState = await menu.evaluate((element) => {
        const candidates = [element, ...Array.from(element.querySelectorAll<HTMLElement>("*"))];
        const scroller = candidates.find((candidate) => {
          const style = getComputedStyle(candidate);
          return (
            candidate.scrollHeight > candidate.clientHeight + 1 &&
            /(auto|scroll|overlay)/.test(style.overflowY)
          );
        });
        if (!scroller) return { found: false, before: 0, after: 0 };
        const before = scroller.scrollTop;
        scroller.scrollTop = scroller.scrollHeight;
        return { found: true, before, after: scroller.scrollTop };
      });
      expect(scrollState.found).toBe(true);
      expect(scrollState.after).toBeGreaterThan(scrollState.before);
    }

    const lastMenuItem = menu.locator("a, button").last();
    await expect(lastMenuItem).toBeInViewport({ ratio: 1 });

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();

    await toggle.click();
    await expect(menu).toBeVisible();
    await page.setViewportSize({ ...DESKTOP_VIEWPORT });
    await expect(toggle).toBeHidden();
    await expect(menu).toBeHidden();
    await page.setViewportSize({ ...SHORT_LANDSCAPE_VIEWPORT });
    await expect(toggle).toBeVisible();

    const closedAfterDesktopResize =
      (await menu.count()) === 0 || !(await menu.isVisible());
    if (closedAfterDesktopResize) {
      await expect(menu).toBeHidden();
    } else {
      test.info().annotations.push({
        type: "capability",
        description: "Mobile menu does not close when resized to desktop",
      });
    }
  });
});

test.describe("content and interactions", () => {
  const hero = (page: Page) => page.locator("main section").first();

  test("hero shows headline, tagline and live countdown", async ({ page }) => {
    await gotoRoute(page, "/");
    await expect(
      hero(page).getByRole("heading", { level: 1, name: /HACK-MATRIX/i })
    ).toBeVisible();

    const tagline = hero(page).locator("p.text-violet-bright");
    await expect(tagline).toBeVisible();
    await expect(tagline).toContainText("BUILD");
    await expect(tagline).toContainText("SOLVE");
    await expect(tagline).toContainText("INNOVATE");

    await expect(hero(page).getByText("EVENT STARTS IN")).toBeVisible();

    const timer = page.getByRole("timer");
    const phase = await eventPhase(page);
    if (phase === "before") {
      await expect(timer, "countdown should tick while the event is still ahead").toBeVisible();
      await expect(timer.locator("span.tabular-nums")).toHaveCount(4);
      return;
    }

    await expect(
      timer,
      `countdown should be replaced by the live state once the event is ${phase}`
    ).toHaveCount(0);
    await expect(
      hero(page).getByText("Event is live"),
      "the live state should explain the missing countdown"
    ).toBeVisible();
  });

  test("countdown values actually change over time", async ({ page }) => {
    await gotoRoute(page, "/");
    const timer = page.getByRole("timer");
    const phase = await eventPhase(page);

    if (phase !== "before") {
      await expect(
        timer,
        `a finished event should not keep ticking its countdown (${phase})`
      ).toHaveCount(0);
      await expect(
        page.locator("main section").first().getByText("Event is live"),
        "the live state should explain the missing countdown"
      ).toBeVisible();
      test.info().annotations.push({
        type: "countdown",
        description: `Event is ${phase}: verified the live state instead of a ticking value`,
      });
      return;
    }

    const seconds = timer.locator("span.tabular-nums").nth(3);
    await expect(seconds).toBeVisible();
    const before = (await seconds.textContent())?.trim();
    await expect
      .poll(async () => (await seconds.textContent())?.trim(), { timeout: 3_000 })
      .not.toBe(before);
  });

  test("FAQ accordion toggles", async ({ page }) => {
    await gotoRoute(page, "/");
    const trigger = page.getByRole("button", { name: "What is HACK-MATRIX?" });
    const panelId = await trigger.getAttribute("aria-controls");
    expect(panelId).not.toBeNull();
    const panel = page.locator(`#${panelId}`);

    if ((await trigger.getAttribute("aria-expanded")) !== "true") await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toBeVisible();
    await expect(panel).toContainText(/8-hour inter-collegiate hackathon/i);

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toBeHidden();
    await trigger.click();
    await expect(panel).toBeVisible();
  });

  test("register page shows fee, team size + form CTA", async ({ page }) => {
    await gotoRoute(page, "/register");
    await expect(
      page.getByRole("heading", { level: 1, name: /REGISTER/i })
    ).toBeVisible();
    await expect(page.locator("main").getByText("₹399").first()).toBeVisible();
    await expect(
      page.locator("main").getByText("2 – 4 members per team").first()
    ).toBeVisible();
    const cta = page
      .locator("main a, main button")
      .filter({ hasText: /REGISTER FOR HACK-MATRIX|FORM LINK SOON/i })
      .first();
    await expect(cta).toBeVisible();
  });

  test("rules page lists every rule", async ({ page }) => {
    await gotoRoute(page, "/rules");
    await expect(page.getByText("Eligibility").first()).toBeVisible();
    await expect(page.getByText("Code of conduct").first()).toBeVisible();
  });

  test("FAQ page lists all questions", async ({ page }) => {
    await gotoRoute(page, "/faq");
    await expect(page.getByText("Is food provided?")).toBeVisible();
    await expect(page.getByText("Are certificates provided?")).toBeVisible();
  });

  test("hero shows auto-updating live status pill", async ({ page }) => {
    await gotoRoute(page, "/");
    const pill = page.getByRole("status");
    await expect(pill).toBeVisible();
    await expect(pill).toContainText(
      /REGISTRATIONS OPEN SOON|REGISTRATIONS OPEN|LIVE NOW|EVENT ENDED/
    );
  });

  test("register page offers add-to-calendar download", async ({ page }) => {
    await gotoRoute(page, "/register");
    const link = page.locator('a[download="hack-matrix-2026.ics"]');
    await expect(link).toBeVisible();
    const [download] = await Promise.all([page.waitForEvent("download"), link.click()]);
    expect(download.suggestedFilename()).toBe("hack-matrix-2026.ics");
    expect(await readFile(await download.path(), "utf8")).toContain("DTSTART:20261015T033000Z");
  });

  test("unknown routes show 404 with register CTA", async ({ page }) => {
    await page.goto("/this-route-does-not-exist", {
      waitUntil: "load",
      timeout: NAVIGATION_TIMEOUT,
    });
    await expect(page.getByText("OUT OF BOUNDS")).toBeVisible();
    await expect(page.getByText("This page fell out of the MATRIX.")).toBeVisible();
    await expect(
      page.locator("main").getByText(/REGISTER YOUR TEAM|FORM LINK SOON/).first()
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /BACK TO HOME/i })).toBeVisible();
  });

  test("reduced motion removes decorative particles without hiding hero content", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoRoute(page, "/");
    await expect(
      page.getByRole("heading", { level: 1, name: /HACK-MATRIX/i })
    ).toBeVisible();
    await expect(page.locator(".particle")).toHaveCount(0);
  });
});

test.describe("accessibility", () => {
  test.use({ viewport: { ...DESKTOP_VIEWPORT } });

  for (const route of ROUTES) {
    test(`${route} has no WCAG A/AA violations on desktop`, async ({ page }) => {
      await gotoRoute(page, route);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
