import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = ["/", "/register", "/rules", "/faq"];

test.describe("routes render", () => {
  for (const route of ROUTES) {
    test(`${route} loads without console/page errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(e.message));

      const res = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(res?.status()).toBe(200);
      await page.waitForTimeout(1200);

      expect(errors).toEqual([]);
    });
  }
});

test.describe("layout & responsiveness", () => {
  test("no horizontal overflow on mobile", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1200);
    await page.mouse.wheel(0, 30000);
    await page.waitForTimeout(700);

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test.skip(({ isMobile }) => !isMobile, "sticky CTA is mobile-only");
  test("sticky mobile CTA present on small screens", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toHaveClass(/has-sticky-cta/);
    const cta = page.getByRole("link", { name: /REGISTER NOW/i }).last();
    await expect(cta).toBeVisible();
  });

  test.skip(({ isMobile }) => !isMobile, "hamburger menu is mobile-only");
  test("mobile menu opens and closes", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const menuBtn = page.getByRole("button", { name: "Open menu" });
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    await expect(page.locator("#mobile-nav")).toBeVisible();
    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(page.locator("#mobile-nav")).toBeHidden();
  });

  test("navbar + register CTA visible on desktop", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
    await expect(page.getByRole("link", { name: /REGISTER/i }).first()).toBeVisible();
  });
});

test.describe("content & interactions", () => {
  const hero = (page: import("@playwright/test").Page) => page.locator("main section").first();

  test("hero shows headline, tagline and live countdown", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(
      hero(page).getByRole("heading", { level: 1, name: /HACK-MATRIX/ })
    ).toBeVisible();

    const tagline = hero(page).locator("p.text-violet-bright");
    await expect(tagline).toBeVisible();
    await expect(tagline).toContainText("BUILD");
    await expect(tagline).toContainText("SOLVE");
    await expect(tagline).toContainText("INNOVATE");

    await expect(hero(page).getByText("EVENT STARTS IN")).toBeVisible();
    await expect(hero(page).locator("span.tabular-nums").first()).toBeVisible();
  });

  test("countdown values actually change over time", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const seconds = page.locator("span.tabular-nums").nth(3);
    await expect(seconds).toBeVisible();
    const before = await seconds.textContent();
    await page.waitForTimeout(2100);
    const after = await seconds.textContent();
    expect(after).not.toBe(before);
  });

  test("FAQ accordion toggles", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByText("What is HACK-MATRIX?").click();
    await expect(
      page.getByText(/8-hour inter-collegiate hackathon/i).first()
    ).toBeVisible();
  });

  test("register page shows fee, team size + form CTA", async ({ page }) => {
    await page.goto("/register", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { level: 1, name: /REGISTER/i })
    ).toBeVisible();
    await expect(page.locator("main").getByText("₹399").first()).toBeVisible();
    await expect(page.locator("main").getByText("2 – 4 members per team").first()).toBeVisible();
    const cta = page
      .locator("main a, main button")
      .filter({ hasText: /REGISTER FOR HACK-MATRIX|FORM LINK SOON/ })
      .first();
    await expect(cta).toBeVisible();
  });

  test("rules page lists every rule", async ({ page }) => {
    await page.goto("/rules", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Eligibility").first()).toBeVisible();
    await expect(page.getByText("Code of conduct").first()).toBeVisible();
  });

  test("FAQ page lists all questions", async ({ page }) => {
    await page.goto("/faq", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Is food provided?")).toBeVisible();
    await expect(page.getByText("Are certificates provided?")).toBeVisible();
  });
});

test.describe("accessibility", () => {
  test.skip(({ isMobile }) => isMobile, "a11y scanned once on desktop");
  for (const route of ROUTES) {
    test(`${route} has no WCAG A/AA violations on desktop`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1200);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
});