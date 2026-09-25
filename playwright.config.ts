import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { chromium, defineConfig, type LaunchOptions } from "@playwright/test";

const baseURL = "http://127.0.0.1:4173";
const isCI = Boolean(process.env.CI);
const PROBE_TIMEOUT = 20_000;

const CHROMIUM_BROWSERS = [
  {
    label: "Google Chrome",
    windows: ["Google", "Chrome", "Application", "chrome.exe"],
    macApp: "Google Chrome.app",
    linuxPaths: ["/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/opt/google/chrome/chrome"],
  },
  {
    label: "Microsoft Edge",
    windows: ["Microsoft", "Edge", "Application", "msedge.exe"],
    macApp: "Microsoft Edge.app",
    linuxPaths: ["/usr/bin/microsoft-edge", "/usr/bin/microsoft-edge-stable"],
  },
] as const;

function installedBrowserCandidates(): { label: string; executablePath: string }[] {
  const candidates: { label: string; executablePath: string }[] = [];

  for (const browser of CHROMIUM_BROWSERS) {
    if (process.platform === "win32") {
      const roots = [
        process.env.PROGRAMFILES,
        process.env["PROGRAMFILES(X86)"],
        process.env.LOCALAPPDATA,
      ].filter((root): root is string => Boolean(root));
      for (const root of roots) {
        candidates.push({ label: browser.label, executablePath: join(root, ...browser.windows) });
      }
      continue;
    }

    if (process.platform === "darwin") {
      const bundleBinary = browser.macApp.replace(/\.app$/, "");
      for (const root of ["/Applications", join(homedir(), "Applications")]) {
        candidates.push({
          label: browser.label,
          executablePath: join(root, browser.macApp, "Contents", "MacOS", bundleBinary),
        });
      }
      continue;
    }

    for (const executablePath of browser.linuxPaths) {
      candidates.push({ label: browser.label, executablePath });
    }
  }

  return candidates;
}

async function probeVersion(launchOptions: LaunchOptions): Promise<string> {
  const browser = await chromium.launch({ headless: true, timeout: PROBE_TIMEOUT, ...launchOptions });
  try {
    return browser.version();
  } finally {
    await browser.close();
  }
}

function failureReason(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.split("\n")[0] ?? message;
}

async function selectBrowser(): Promise<{ label: string; launchOptions?: LaunchOptions }> {
  const rejected: string[] = [];

  try {
    const version = await probeVersion({});
    return { label: `Playwright Chromium ${version}` };
  } catch (error) {
    rejected.push(`bundled Playwright Chromium: ${failureReason(error)}`);
  }

  for (const candidate of installedBrowserCandidates()) {
    if (!existsSync(candidate.executablePath)) continue;
    try {
      const version = await probeVersion({ executablePath: candidate.executablePath });
      return {
        label: `${candidate.label} ${version}`,
        launchOptions: { executablePath: candidate.executablePath },
      };
    } catch (error) {
      rejected.push(`${candidate.label} (${candidate.executablePath}): ${failureReason(error)}`);
    }
  }

  throw new Error(
    [
      "No usable Chromium build for the end-to-end tests.",
      'Run "npx playwright install chromium" to install the revision this Playwright version expects,',
      "or install Google Chrome or Microsoft Edge (a user-level ~/Applications install works on macOS).",
      ...rejected.map((reason) => `Tried ${reason}`),
    ].join("\n")
  );
}

const browser = await selectBrowser();
const inRunnerProcess = !process.env.TEST_WORKER_INDEX && !process.env.TEST_PARALLEL_INDEX;
if (inRunnerProcess) console.log(`[playwright] ${browser.label}`);

export default defineConfig({
  testDir: "tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: isCI ? 2 : 0,
  forbidOnly: isCI,
  reporter: [["list"]],
  use: {
    baseURL,
    ...(browser.launchOptions ? { launchOptions: browser.launchOptions } : {}),
    trace: "retain-on-failure",
    headless: true,
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
  webServer: {
    command: "npm run build && npm run preview -- --host 127.0.0.1 --port 4173 --strictPort",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
