import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = fs.readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');

const raw = new Map<string, string>();
for (const m of css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) raw.set(m[1]!, m[2]!.trim());

function resolve(name: string, depth = 0): string {
  const value = raw.get(name);
  if (!value) throw new Error(`Unknown token ${name}`);
  const ref = /^var\((--[\w-]+)\)$/.exec(value);
  if (ref) {
    if (depth > 5) throw new Error(`Token alias loop at ${name}`);
    return resolve(ref[1]!, depth + 1);
  }
  return value;
}

function hex(name: string): [number, number, number] {
  const v = name.startsWith('#') ? name : resolve(name);
  const m = /^#([0-9a-f]{6})$/i.exec(v);
  if (!m) throw new Error(`Token ${name} is not a 6-digit hex color: ${v}`);
  const n = parseInt(m[1]!, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const lin = (c: number) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]: [number, number, number]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a: string, b: string) => {
  const [hi, lo] = [lum(hex(a)), lum(hex(b))].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
};

/** Normal-size text: WCAG AA needs 4.5:1. */
const TEXT_PAIRS: Array<[string, string]> = [
  ['--ui-ink', '--ui-page'],
  ['--ui-ink', '--ui-surface'],
  ['--ui-muted', '--ui-page'],
  ['--ui-muted', '--ui-surface'],
  ['--ui-on-primary', '--ui-primary'],
  ['--status-new-fg', '--status-new-bg'],
  ['--status-active-fg', '--status-active-bg'],
  ['--status-review-fg', '--status-review-bg'],
  ['--status-done-fg', '--status-done-bg'],
  ['--ui-attention-ink', '--ui-attention-tint'],
  ['--wordmark-ink', '--ui-page'],
  ['--wordmark-ink', '--ui-surface'],
];

/** Graphics, borders, icons, focus rings: WCAG 1.4.11 needs 3:1. */
const GRAPHIC_PAIRS: Array<[string, string]> = [
  ['--ui-attention', '--ui-page'],
  ['--ui-attention', '--ui-surface'],
  ['--ui-progress', '--ui-page'],
  ['--ui-progress', '--ui-surface'],
  ['--ui-focus', '--ui-page'],
  ['--ui-focus', '--ui-surface'],
  ['--wordmark-accent', '--ui-page'],
  ['--wordmark-accent', '--ui-surface'],
];

/** Recorded for DECISIONS.md: why Copper never carries normal-size text. Not asserted as passing. */
const COPPER_RECORD: Array<[string, string]> = [
  ['#ffffff', '--ui-attention'],
  ['--brand-night', '--ui-attention'],
  ['--brand-indigo', '--ui-attention'],
];

describe('design token contrast', () => {
  it.each(TEXT_PAIRS)('text %s on %s is at least 4.5:1', (fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(GRAPHIC_PAIRS)('graphic %s on %s is at least 3:1', (fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(3);
  });

  it('keeps Copper out of normal-size text (white on Copper stays below 4.5:1)', () => {
    expect(ratio('#ffffff', '--ui-attention')).toBeLessThan(4.5);
  });

  it('prints the measured ratios', () => {
    const rows = [
      ...TEXT_PAIRS.map(([a, b]) => ({ kind: 'text', fg: a, bg: b, ratio: ratio(a, b).toFixed(2) })),
      ...GRAPHIC_PAIRS.map(([a, b]) => ({ kind: 'graphic', fg: a, bg: b, ratio: ratio(a, b).toFixed(2) })),
      ...COPPER_RECORD.map(([a, b]) => ({ kind: 'copper-record', fg: a, bg: b, ratio: ratio(a, b).toFixed(2) })),
    ];
    console.table(rows);
    expect(rows.length).toBeGreaterThan(0);
  });

  it('has no dark-theme tokens', () => {
    expect(css).not.toMatch(/prefers-color-scheme|data-theme/);
  });
});
