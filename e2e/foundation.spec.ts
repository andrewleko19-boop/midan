import fs from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

const SHOTS = 'artifacts/step1';
fs.mkdirSync(SHOTS, { recursive: true });

test.describe('Step 1 foundation', () => {
  async function visit(page: Page, baseURL: string) {
    const origin = new URL(baseURL).origin;
    const external: string[] = [];
    const consoleErrors: string[] = [];
    const requested: string[] = [];
    page.on('request', (req) => {
      const url = req.url();
      requested.push(url);
      if (!url.startsWith(origin) && !url.startsWith('data:') && !url.startsWith('blob:')) external.push(url);
    });
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(`${m.text()} @ ${m.location().url}`);
    });
    page.on('pageerror', (e) => consoleErrors.push(String(e)));
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    return { external, consoleErrors, requested };
  }

  test('document is Arabic and RTL', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('makes no request outside its own origin', async ({ page, baseURL }) => {
    const { external } = await visit(page, baseURL!);
    expect(external, `requests leaving the origin:\n${external.join('\n')}`).toEqual([]);
  });

  test('Readex Pro 400/500/600 are loaded from local files, not a CDN', async ({ page, baseURL }) => {
    const { requested } = await visit(page, baseURL!);
    const loaded = await page.evaluate(() =>
      [...document.fonts].filter((f) => f.family.replace(/"/g, '') === 'Readex Pro' && f.status === 'loaded').map((f) => `${f.weight}`),
    );
    for (const w of ['400', '500', '600']) expect(loaded, `Readex Pro ${w} not loaded`).toContain(w);
    expect(requested.filter((u) => /fonts\.(googleapis|gstatic)\.com/.test(u))).toEqual([]);
  });

  // Deterministic check for the favicon / touch icon / manifest links in index.html.
  // Fails until `npm run brand:copy` has put the real brand files in public/.
  test('every icon and manifest link in index.html resolves to a real file', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page.$$eval('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]', (els) =>
      els.map((e) => (e as HTMLLinkElement).href),
    );
    expect(hrefs.length).toBeGreaterThan(0);
    const bad: string[] = [];
    for (const href of hrefs) {
      const res = await page.request.get(href);
      const type = res.headers()['content-type'] ?? '';
      if (!res.ok() || type.includes('text/html')) bad.push(`${href} -> ${res.status()} ${type}`);
    }
    expect(bad, `unresolved links:\n${bad.join('\n')}`).toEqual([]);
  });

  // Fails until the brand package is copied: index.html links favicon/manifest files that come from it.
  test('has no console errors or failed resources', async ({ page, baseURL }) => {
    const { consoleErrors } = await visit(page, baseURL!);
    expect(consoleErrors, `console errors:\n${consoleErrors.join('\n')}`).toEqual([]);
  });

  test('light theme only: dark color-scheme preference changes nothing', async ({ browser, baseURL }) => {
    const bg = async (colorScheme: 'light' | 'dark') => {
      const ctx = await browser.newContext({ colorScheme, baseURL });
      const page = await ctx.newPage();
      await page.goto('/');
      const out = await page.evaluate(() => ({
        bg: getComputedStyle(document.body).backgroundColor,
        scheme: getComputedStyle(document.documentElement).colorScheme,
      }));
      await ctx.close();
      return out;
    };
    const light = await bg('light');
    const dark = await bg('dark');
    expect(light.bg).toBe('rgb(244, 237, 224)'); // Sand #F4EDE0
    expect(dark).toEqual(light);
    expect(light.scheme).toBe('light');
  });

  for (const [name, width, height] of [['360', 360, 800], ['1440', 1440, 900]] as const) {
    test(`no horizontal scroll and screenshot at ${name}px`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      await page.screenshot({ path: `${SHOTS}/foundation-${name}.png`, fullPage: true });
    });
  }
});
