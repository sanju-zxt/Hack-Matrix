# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: site.spec.ts >> layout & responsiveness >> sticky mobile CTA present on small screens
- Location: tests\site.spec.ts:38:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: /REGISTER NOW/i }).last()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('link', { name: /REGISTER NOW/i }).last() with timeout 5000ms
  - waiting for getByRole('link', { name: /REGISTER NOW/i }).last()

```

```yaml
- link "Skip to content":
  - /url: "#main"
- banner:
  - navigation "Main":
    - link "HACK-MATRIX home":
      - /url: /
      - img "Vijaya Vittala Institute of Technology logo"
      - text: HACK-MATRIX 2026 Â· 8 Hour Inter Collegiate Hackathon
    - button "Open menu"
- main:
  - img "Vijaya Vittala Institute of Technology logo"
  - text: Vijaya Vittala Institute of Technology
  - heading "HACK-MATRIX 2026" [level=1]
  - paragraph: BUILD SOLVE INNOVATE
  - paragraph: An intense 8-hour build-from-zero hackathon where teams receive the problem statement at the start of the event and turn ideas into working solutions.
  - button "FORM LINK SOON"
  - button "VIEW DETAILS"
  - list:
    - listitem: 8 HOURS build from zero
    - listitem: INTER-COLLEGIATE open to all colleges
    - listitem: BENGALURU on-campus event
    - listitem: TEAM 4 2 – 4 members per team
  - paragraph: EVENT STARTS IN
  - text: 20 days 17 hours 02 minutes 39 seconds
  - paragraph: Check-in opens at 09:00 IST · times may be fine-tuned by the organizing team
  - paragraph: 15 October 2026 Â· 09:00 â€“ 19:00 IST
  - paragraph: Vijaya Vittala Institute of Technology
  - paragraph: Offline + Hybrid Â· ₹399 per team
  - paragraph: Event Overview
  - heading "Everything you need to know" [level=2]
  - paragraph: The essential details at a glance â€” all controlled from the central configuration.
  - list:
    - listitem:
      - paragraph: Date
      - paragraph: 15 October 2026
      - paragraph: Mark your calendars
    - listitem:
      - paragraph: Time
      - paragraph: 09:00 â€“ 19:00
      - paragraph: IST timezone
    - listitem:
      - paragraph: Venue
      - paragraph: Vijaya Vittala Institute of Technology
      - paragraph: Bengaluru, Karnataka, India
    - listitem:
      - paragraph: Duration
      - paragraph: 8 Hours
      - paragraph: of pure build time
    - listitem:
      - paragraph: Format
      - paragraph: Offline + Hybrid
      - paragraph: on-campus Â· hybrid slots
    - listitem:
      - paragraph: Team Size
      - paragraph: 2 – 4 members per team
      - paragraph: leader + members
    - listitem:
      - paragraph: Registration Fee
      - paragraph: ₹399 per team
      - paragraph: payable via registration form
  - paragraph: About the Event
  - heading "An 8-hour sprint from zero to shipped" [level=2]
  - paragraph: HACK-MATRIX is an 8-hour innovation sprint where participants receive the challenge / problem statements at the beginning of the event. Teams must ideate, design, develop, deploy and present a working solution within the given time.
  - paragraph: No pre-built projects, no prepared pitches — everything starts from zero on event day. What matters is how fast your team can think, prototype and ship.
  - text: 7 pillars guide the build Â· powered by VVIT Bengaluru
  - paragraph: "01"
  - heading "Build from zero" [level=3]
  - paragraph: Ideate, build and ship within the event window.
  - paragraph: "02"
  - heading "Real-world problem solving" [level=3]
  - paragraph: Tackle practical challenges that matter.
  - paragraph: "03"
  - heading "Rapid prototyping" [level=3]
  - paragraph: Turn an idea into a working demo — fast.
  - paragraph: "04"
  - heading "AI & emerging tech" [level=3]
  - paragraph: Experiment with the stacks that define tomorrow.
  - paragraph: "05"
  - heading "Deployment" [level=3]
  - paragraph: Ship something that actually runs and works.
  - paragraph: "06"
  - heading "Final demonstration" [level=3]
  - paragraph: Present your solution live to judges.
  - paragraph: "07"
  - heading "Industry exposure" [level=3]
  - paragraph: Interact with peers, mentors and reviewers.
  - paragraph: How it works
  - heading "Seven steps from registration to results" [level=2]
  - paragraph: A sharp, predictable journey â€” so your team can focus entirely on building.
  - list:
    - listitem:
      - paragraph: Step 01
      - heading "Register" [level=3]
      - paragraph: Complete your team registration.
    - listitem:
      - paragraph: Step 02
      - heading "Check In" [level=3]
      - paragraph: Arrive at the venue and complete verification.
    - listitem:
      - paragraph: Step 03
      - heading "Problem Reveal" [level=3]
      - paragraph: Problem statements are released at the beginning of the event.
    - listitem:
      - paragraph: Step 04
      - heading "Build" [level=3]
      - paragraph: Teams have 8 hours to build their solution.
    - listitem:
      - paragraph: Step 05
      - heading "Submit" [level=3]
      - paragraph: Submit project, repository and required documentation before the deadline.
    - listitem:
      - paragraph: Step 06
      - heading "Demo" [level=3]
      - paragraph: Shortlisted teams present their solutions to the judges.
    - listitem:
      - paragraph: Step 07
      - heading "Results" [level=3]
      - paragraph: Winners are announced during the closing ceremony.
  - paragraph: Themes
  - heading "Choose your battlefield" [level=2]
  - paragraph: Problem statements fall across these domains. Final problem statements will be revealed at the beginning of the hackathon.
  - list:
    - listitem:
      - heading "Artificial Intelligence" [level=3]
      - paragraph: Intelligent systems, reasoning, agents and generative AI.
    - listitem:
      - heading "Machine Learning" [level=3]
      - paragraph: Models, predictions and data-driven decision making.
    - listitem:
      - heading "Data Science" [level=3]
      - paragraph: Extracting insight from data and building analytics tools.
    - listitem:
      - heading "Web & Full-Stack" [level=3]
      - paragraph: Modern applications, APIs and complete product builds.
    - listitem:
      - heading "Automation" [level=3]
      - paragraph: Tools and bots that reduce human effort and error.
    - listitem:
      - heading "Cybersecurity" [level=3]
      - paragraph: Protecting systems, data and privacy in a connected world.
    - listitem:
      - heading "Cloud & DevOps" [level=3]
      - paragraph: Infrastructure, deployment, scaling and reliability.
    - listitem:
      - heading "Social Impact" [level=3]
      - paragraph: Technology that solves problems for communities.
    - listitem:
      - heading "Open Innovation" [level=3]
      - paragraph: Anything bold, novel and unexpected — build it.
  - paragraph:
    - strong: "Heads up:"
    - text: Final problem statements will be revealed at the beginning of the hackathon. Themes shown here are categories to guide preparation — not the final specifications.
  - paragraph: Eligibility
  - heading "Who can participate?" [level=2]
  - paragraph: If you study tech â€” or just love building â€” you belong here.
  - list:
    - listitem:
      - paragraph: Engineering students
      - paragraph: All branches — B.E. / B.Tech
    - listitem:
      - paragraph: Computer Science
      - paragraph: CSE / ISE / AI & DS / ML
    - listitem:
      - paragraph: AI / ML students
      - paragraph: Core & applied AI programs
    - listitem:
      - paragraph: Data Science students
      - paragraph: Analytics, engineering & statistics
    - listitem:
      - paragraph: Electronics & other disciplines
      - paragraph: ECE, EEE, mechanical, civil…
    - listitem:
      - paragraph: Anyone passionate about tech & innovation
      - paragraph: Interest matters more than the degree
  - paragraph: Configurable — entry criteria, year bands and any college restrictions are controlled by the organizing team.
  - paragraph: Registration open
  - heading "Ready to ship something extraordinary?" [level=2]
  - paragraph: ₹399 per team Â· teams of 2â€“4. Registering takes about 5 minutes â€” the form opens in a new tab.
  - button "FORM LINK SOON"
  - link "Registration guide":
    - /url: /register
  - text: "Deadline: To be announced 2 – 4 members per team Questions? Email the organizing team"
  - heading "How registration works" [level=3]
  - list:
    - listitem:
      - paragraph: 1 Â· Fill the registration form
      - paragraph: Complete all team + member details in the official form.
    - listitem:
      - paragraph: 2 Â· Complete the fee payment
      - paragraph: ₹399 per team Â· instructions inside the form.
    - listitem:
      - paragraph: 3 Â· Get confirmed
      - paragraph: Receive your confirmation with check-in details before event day.
  - paragraph: Event snapshot
  - paragraph: HACK-MATRIX 2026 Â· 15 October 2026 Â· 09:00â€“19:00 IST
  - paragraph: Vijaya Vittala Institute of Technology
  - paragraph: Offline + Hybrid Â· ₹399 per team
  - paragraph: Partners & Sponsors
  - heading "Backed by great partners" [level=2]
  - paragraph: We're partnering with organizations that believe in student innovation.
  - paragraph: PARTNERS WILL BE ANNOUNCED SOON
  - paragraph: Category slots are reserved below â€” official logos and details will appear here as partnerships are finalized.
  - list:
    - listitem: Title Partner
    - listitem: Technology Partner
    - listitem: AI Partner
    - listitem: Cloud Partner
    - listitem: Developer Partner
    - listitem: Community Partner
  - paragraph: Prizes
  - heading "What's worth building for" [level=2]
  - paragraph: Rewards for the best builds across the day.
  - paragraph: PRIZES & SPECIAL AWARDS — TO BE ANNOUNCED
  - paragraph: Prize tiers are being finalized. When announced, categories like the ones below will light up â€” keep an eye on our social channels.
  - list:
    - listitem: Winner
    - listitem: Runner Up
    - listitem: Best AI Solution
    - listitem: Best Use of APIs
    - listitem: Best Automation
    - listitem: Best Cloud Deployment
    - listitem: Special Jury Award
  - paragraph: Event Timeline
  - heading "The day, hour by hour" [level=2]
  - paragraph: Key milestones planned around the event. Fine-tuned timing is published closer to the day.
  - list:
    - listitem:
      - paragraph: Registration Opens
      - paragraph: To be announced
      - text: TBA
    - listitem:
      - paragraph: Registration Closes
      - paragraph: To be announced
      - text: TBA
    - listitem:
      - paragraph: Event Day
      - paragraph: 15 October 2026
    - listitem:
      - paragraph: Problem Statement Reveal
      - paragraph: At event start · 09:00 IST
    - listitem:
      - paragraph: Submission Deadline
      - paragraph: Announced at the event
      - text: TBA
    - listitem:
      - paragraph: Final Presentations
      - paragraph: Announced at the event
      - text: TBA
    - listitem:
      - paragraph: Results & Closing
      - paragraph: Announced at the event
      - text: TBA
  - paragraph: All times in IST Â· [TBA] slots are confirmed by the organizing team
  - paragraph: Rules
  - heading "Built to be fair" [level=2]
  - paragraph: Ground rules at a glance â€” the complete list is one click away.
  - list:
    - listitem:
      - paragraph: Eligibility
      - paragraph: "Open to currently enrolled college students. Team members must provide valid institutional email / college details. [Organizers: finalize eligible colleges & year bands]"
    - listitem:
      - paragraph: Team size
      - paragraph: Teams of 2–4 members. Each participant may be part of only one team.
    - listitem:
      - paragraph: Originality
      - paragraph: All work must be original and created during the event. Pre-built or submitted-elsewhere projects are not permitted.
    - listitem:
      - paragraph: AI usage
      - paragraph: "AI-assisted development is permitted and encouraged — but the understanding of your solution must be demonstrated during evaluation. [Organizers: finalize AI-tool policy]"
  - link "VIEW FULL RULES":
    - /url: /rules
  - paragraph: All rules are configurable â€” the organizing team finalizes them before registration closes.
  - paragraph: FAQ
  - heading "Frequently asked questions" [level=2]
  - paragraph: Everything teams usually ask — answered before you need to ask.
  - heading "What is HACK-MATRIX?" [level=3]:
    - button "What is HACK-MATRIX?" [expanded]
  - region "What is HACK-MATRIX?":
    - paragraph: HACK-MATRIX is an 8-hour inter-collegiate hackathon at VVIT, Bengaluru, where teams receive the problem statement at the start and build a working solution within the event window.
  - heading "Who can participate?" [level=3]:
    - button "Who can participate?"
  - heading "How many members can be in a team?" [level=3]:
    - button "How many members can be in a team?"
  - heading "Is the event online or offline?" [level=3]:
    - button "Is the event online or offline?"
  - heading "What should participants bring?" [level=3]:
    - button "What should participants bring?"
  - heading "Will the problem statement be provided beforehand?" [level=3]:
    - button "Will the problem statement be provided beforehand?"
  - heading "Can we use AI tools?" [level=3]:
    - button "Can we use AI tools?"
  - heading "Can we use external APIs?" [level=3]:
    - button "Can we use external APIs?"
  - heading "Is GitHub required?" [level=3]:
    - button "Is GitHub required?"
  - heading "What happens after registration?" [level=3]:
    - button "What happens after registration?"
  - heading "Is food provided?" [level=3]:
    - button "Is food provided?"
  - heading "Are certificates provided?" [level=3]:
    - button "Are certificates provided?"
  - heading "What are the judging criteria?" [level=3]:
    - button "What are the judging criteria?"
  - heading "How will teams submit their projects?" [level=3]:
    - button "How will teams submit their projects?"
  - paragraph:
    - text: Still have questions? Email the organizing team —
    - link "hackmatrix@vvit.edu.in":
      - /url: mailto:hackmatrix@vvit.edu.in
  - link "Open the full FAQ page":
    - /url: /faq
  - paragraph: Contact
  - heading "Talk to the organizing team" [level=2]
  - link "Email hackmatrix@vvit.edu.in":
    - /url: mailto:hackmatrix@vvit.edu.in
  - link "Phone +91 XXXXX XXXXX":
    - /url: tel:+91
  - text: Venue Vijaya Vittala Institute of Technology Bengaluru, Karnataka, India
  - link "Instagram":
    - /url: https://instagram.com/vvithackmatrix
  - link "LinkedIn":
    - /url: https://linkedin.com/in/vvit-bengaluru
  - link "View on Google Maps":
    - /url: https://www.google.com/maps/search/?api=1&query=Vijaya%20Vittala%20Institute%20of%20Technology%20Bengaluru
  - heading "Send a message" [level=3]
  - paragraph: Your email app opens with everything pre-filled â€” just hit send.
  - text: Name
  - textbox "Name":
    - /placeholder: Your full name
  - text: Email
  - textbox "Email":
    - /placeholder: you@example.com
  - text: Phone (optional)
  - textbox "Phone (optional)":
    - /placeholder: +91 â€¦
  - text: Subject
  - textbox "Subject": HACK-MATRIX 2026 enquiry
  - text: Message
  - textbox "Message":
    - /placeholder: Tell us how we can helpâ€¦
  - button "Send message"
  - paragraph: Opens your email app â€” no data is stored.
  - iframe
- contentinfo:
  - img "Vijaya Vittala Institute of Technology logo"
  - text: HACK-MATRIX 2026 Â· 8 Hour Inter Collegiate Hackathon
  - paragraph: 8-Hour Inter-Collegiate Hackathon at Vijaya Vittala Institute of Technology, Bengaluru. BUILD. SOLVE. INNOVATE..
  - text: 15 October 2026 Vijaya Vittala Institute of Technology
  - navigation "Footer quick links":
    - heading "Quick Links" [level=3]
    - list:
      - listitem:
        - link "Home":
          - /url: /
      - listitem:
        - link "About":
          - /url: /#about
      - listitem:
        - link "Themes":
          - /url: /#themes
      - listitem:
        - link "Timeline":
          - /url: /#timeline
      - listitem:
        - link "Rules":
          - /url: /rules
      - listitem:
        - link "FAQ":
          - /url: /faq
      - listitem:
        - link "Register":
          - /url: /register
      - listitem:
        - link "Contact":
          - /url: /#contact
  - heading "Get in touch" [level=3]
  - list:
    - listitem:
      - link "hackmatrix@vvit.edu.in":
        - /url: mailto:hackmatrix@vvit.edu.in
    - listitem:
      - link "+91 XXXXX XXXXX":
        - /url: tel:+91
    - listitem: Bengaluru, Karnataka, India
  - link "Instagram":
    - /url: https://instagram.com/vvithackmatrix
  - link "LinkedIn":
    - /url: https://linkedin.com/in/vvit-bengaluru
  - paragraph: Â© 2026 HACK-MATRIX. All rights reserved.
  - paragraph: HACK-MATRIX 2026 Â· 2 – 4 members per team
- paragraph: Seats limited
- button "FORM LINK SOON"
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | import AxeBuilder from "@axe-core/playwright";
  3   | 
  4   | const ROUTES = ["/", "/register", "/rules", "/faq"];
  5   | 
  6   | test.describe("routes render", () => {
  7   |   for (const route of ROUTES) {
  8   |     test(`${route} loads without console/page errors`, async ({ page }) => {
  9   |       const errors: string[] = [];
  10  |       page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  11  |       page.on("pageerror", (e) => errors.push(e.message));
  12  | 
  13  |       const res = await page.goto(route, { waitUntil: "domcontentloaded" });
  14  |       expect(res?.status()).toBe(200);
  15  |       await page.waitForTimeout(1200);
  16  | 
  17  |       expect(errors).toEqual([]);
  18  |     });
  19  |   }
  20  | });
  21  | 
  22  | test.describe("layout & responsiveness", () => {
  23  |   test("no horizontal overflow on mobile", async ({ page }) => {
  24  |     await page.goto("/", { waitUntil: "domcontentloaded" });
  25  |     await page.waitForTimeout(1200);
  26  |     await page.mouse.wheel(0, 30000);
  27  |     await page.waitForTimeout(700);
  28  | 
  29  |     const overflow = await page.evaluate(
  30  |       () =>
  31  |         document.documentElement.scrollWidth -
  32  |         document.documentElement.clientWidth
  33  |     );
  34  |     expect(overflow).toBeLessThanOrEqual(1);
  35  |   });
  36  | 
  37  |   test.skip(({ isMobile }) => !isMobile, "sticky CTA is mobile-only");
  38  |   test("sticky mobile CTA present on small screens", async ({ page }) => {
  39  |     await page.goto("/", { waitUntil: "domcontentloaded" });
  40  |     await expect(page.locator("body")).toHaveClass(/has-sticky-cta/);
  41  |     const cta = page.getByRole("link", { name: /REGISTER NOW/i }).last();
> 42  |     await expect(cta).toBeVisible();
      |                       ^ Error: expect(locator).toBeVisible() failed
  43  |   });
  44  | 
  45  |   test.skip(({ isMobile }) => !isMobile, "hamburger menu is mobile-only");
  46  |   test("mobile menu opens and closes", async ({ page }) => {
  47  |     await page.goto("/", { waitUntil: "domcontentloaded" });
  48  |     const menuBtn = page.getByRole("button", { name: "Open menu" });
  49  |     await expect(menuBtn).toBeVisible();
  50  |     await menuBtn.click();
  51  |     await expect(page.locator("#mobile-nav")).toBeVisible();
  52  |     await page.getByRole("button", { name: "Close menu" }).click();
  53  |     await expect(page.locator("#mobile-nav")).toBeHidden();
  54  |   });
  55  | 
  56  |   test("navbar + register CTA visible on desktop", async ({ page }) => {
  57  |     await page.goto("/", { waitUntil: "domcontentloaded" });
  58  |     await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
  59  |     await expect(page.getByRole("link", { name: /REGISTER/i }).first()).toBeVisible();
  60  |   });
  61  | });
  62  | 
  63  | test.describe("content & interactions", () => {
  64  |   const hero = (page: import("@playwright/test").Page) => page.locator("main section").first();
  65  | 
  66  |   test("hero shows headline, tagline and live countdown", async ({ page }) => {
  67  |     await page.goto("/", { waitUntil: "domcontentloaded" });
  68  |     await expect(
  69  |       hero(page).getByRole("heading", { level: 1, name: /HACK-MATRIX/ })
  70  |     ).toBeVisible();
  71  | 
  72  |     const tagline = hero(page).locator("p.text-violet-bright");
  73  |     await expect(tagline).toBeVisible();
  74  |     await expect(tagline).toContainText("BUILD");
  75  |     await expect(tagline).toContainText("SOLVE");
  76  |     await expect(tagline).toContainText("INNOVATE");
  77  | 
  78  |     await expect(hero(page).getByText("EVENT STARTS IN")).toBeVisible();
  79  |     await expect(hero(page).locator("span.tabular-nums").first()).toBeVisible();
  80  |   });
  81  | 
  82  |   test("countdown values actually change over time", async ({ page }) => {
  83  |     await page.goto("/", { waitUntil: "domcontentloaded" });
  84  |     const seconds = page.locator("span.tabular-nums").nth(3);
  85  |     await expect(seconds).toBeVisible();
  86  |     const before = await seconds.textContent();
  87  |     await page.waitForTimeout(2100);
  88  |     const after = await seconds.textContent();
  89  |     expect(after).not.toBe(before);
  90  |   });
  91  | 
  92  |   test("FAQ accordion toggles", async ({ page }) => {
  93  |     await page.goto("/", { waitUntil: "domcontentloaded" });
  94  |     await page.getByText("What is HACK-MATRIX?").click();
  95  |     await expect(
  96  |       page.getByText(/8-hour inter-collegiate hackathon/i).first()
  97  |     ).toBeVisible();
  98  |   });
  99  | 
  100 |   test("register page shows fee, team size + form CTA", async ({ page }) => {
  101 |     await page.goto("/register", { waitUntil: "domcontentloaded" });
  102 |     await expect(
  103 |       page.getByRole("heading", { level: 1, name: /REGISTER/i })
  104 |     ).toBeVisible();
  105 |     await expect(page.locator("main").getByText("₹399").first()).toBeVisible();
  106 |     await expect(page.locator("main").getByText("2 – 4 members per team").first()).toBeVisible();
  107 |     const cta = page
  108 |       .locator("main a, main button")
  109 |       .filter({ hasText: /REGISTER FOR HACK-MATRIX|FORM LINK SOON/ })
  110 |       .first();
  111 |     await expect(cta).toBeVisible();
  112 |   });
  113 | 
  114 |   test("rules page lists every rule", async ({ page }) => {
  115 |     await page.goto("/rules", { waitUntil: "domcontentloaded" });
  116 |     await expect(page.getByText("Eligibility").first()).toBeVisible();
  117 |     await expect(page.getByText("Code of conduct").first()).toBeVisible();
  118 |   });
  119 | 
  120 |   test("FAQ page lists all questions", async ({ page }) => {
  121 |     await page.goto("/faq", { waitUntil: "domcontentloaded" });
  122 |     await expect(page.getByText("Is food provided?")).toBeVisible();
  123 |     await expect(page.getByText("Are certificates provided?")).toBeVisible();
  124 |   });
  125 | });
  126 | 
  127 | test.describe("accessibility", () => {
  128 |   test.skip(({ isMobile }) => isMobile, "a11y scanned once on desktop");
  129 |   for (const route of ROUTES) {
  130 |     test(`${route} has no WCAG A/AA violations on desktop`, async ({ page }) => {
  131 |       await page.goto(route, { waitUntil: "domcontentloaded" });
  132 |       await page.waitForTimeout(1200);
  133 |       const results = await new AxeBuilder({ page })
  134 |         .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
  135 |         .analyze();
  136 |       expect(results.violations).toEqual([]);
  137 |     });
  138 |   }
  139 | });
```