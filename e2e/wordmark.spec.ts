import fs from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

const SHOTS = 'artifacts/step2';
fs.mkdirSync(SHOTS, { recursive: true });
const MIN = { ar: 40, en: 56, pair: 120, bi: 110 } as const;

async function openLab(page: Page, baseURL: string) {
  const origin = new URL(baseURL).origin;
  const external: string[] = [];
  const errors: string[] = [];
  page.on('request', (r) => {
    const u = r.url();
    if (!u.startsWith(origin) && !u.startsWith('data:') && !u.startsWith('blob:')) external.push(u);
  });
  page.on('console', (m) => m.type() === 'error' && errors.push(`${m.text()} @ ${m.location().url}`));
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto('/#wordmark');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('مختبر الشعار');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => [...document.images].every((i) => i.complete));
  return { external, errors };
}

test.describe('Step 2 wordmark lab', () => {
  test('every wordmark image loads, with no external requests and no console errors', async ({ page, baseURL }) => {
    const { external, errors } = await openLab(page, baseURL!);
    const broken = await page.$$eval('img', (imgs) => imgs.filter((i) => i.naturalWidth === 0).map((i) => i.src.slice(0, 80)));
    expect(broken).toEqual([]);
    expect(external).toEqual([]);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('<Wordmark> images are never rendered below their minimum width', async ({ page, baseURL }) => {
    await openLab(page, baseURL!);
    const sizes = await page.$$eval('img[data-wordmark]:not([data-raw])', (imgs) =>
      imgs.map((i) => ({ v: i.getAttribute('data-wordmark')!, w: i.getBoundingClientRect().width })),
    );
    expect(sizes.length).toBeGreaterThan(5);
    for (const { v, w } of sizes) expect(w, `${v} rendered at ${w}px`).toBeGreaterThanOrEqual(MIN[v as keyof typeof MIN] - 0.5);
  });

  test('the wordmark is static: no animations or transitions anywhere on the page', async ({ page, baseURL }) => {
    await openLab(page, baseURL!);
    const animated = await page.evaluate(() => document.getAnimations().length);
    expect(animated).toBe(0);
    const moving = await page.$$eval('img', (imgs) => imgs.filter((i) => getComputedStyle(i).transitionDuration !== '0s' || getComputedStyle(i).animationName !== 'none').length);
    expect(moving).toBe(0);
  });

  for (const [name, width, height] of [['360', 360, 800], ['1440', 1440, 900]] as const) {
    test(`no horizontal scroll and screenshot at ${name}px`, async ({ page, baseURL }) => {
      await page.setViewportSize({ width, height });
      await openLab(page, baseURL!);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
      await page.screenshot({ path: `${SHOTS}/wordmark-lab-${name}.png`, fullPage: true });
    });
  }
});
