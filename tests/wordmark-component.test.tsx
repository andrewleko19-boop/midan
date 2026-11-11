import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BrandSymbol } from '@/brand/BrandSymbol';
import { Wordmark, wordmarkSize } from '@/brand/Wordmark';
import { SYMBOL_MIN_SIZE, WORDMARK_ALT, WORDMARK_MIN_WIDTH } from '@/brand/wordmark.config';
import { WORDMARK_ASSETS } from '@/brand/wordmark.generated';

const html = (el: React.ReactElement) => renderToStaticMarkup(el);
const attr = (markup: string, name: string) => new RegExp(`${name}="([^"]*)"`).exec(markup)?.[1];

describe('<Wordmark>', () => {
  it('defaults to the Arabic-first pair with the correct accessible name', () => {
    const m = html(<Wordmark width={200} />);
    expect(attr(m, 'data-wordmark')).toBe('pair');
    expect(attr(m, 'alt')).toBe('مِيدان Midan');
  });

  it('derives height from width and width from height using the real aspect ratio', () => {
    for (const variant of ['pair', 'bi', 'ar', 'en'] as const) {
      const { aspect } = WORDMARK_ASSETS[variant];
      const fromWidth = wordmarkSize(variant, { width: 300 });
      expect(fromWidth.width).toBe(300);
      expect(fromWidth.width / fromWidth.height).toBeCloseTo(aspect, 1);
      const fromHeight = wordmarkSize(variant, { height: 100 });
      expect(fromHeight.height).toBeGreaterThan(0);
      expect(fromHeight.width / fromHeight.height).toBeCloseTo(aspect, 1);
    }
  });

  it('never renders below the minimum width', () => {
    for (const variant of ['pair', 'bi', 'ar', 'en'] as const) {
      const min = WORDMARK_MIN_WIDTH[variant];
      const r = wordmarkSize(variant, { width: min - 10 });
      expect(r.clamped).toBe(true);
      expect(r.width).toBe(min);
      expect(wordmarkSize(variant, { width: min }).clamped).toBe(false);
    }
    expect(attr(html(<Wordmark variant="pair" width={60} />), 'data-clamped')).toBe('true');
  });

  it('uses the accent file by default and the single-color file when accent is off', () => {
    expect(attr(html(<Wordmark variant="ar" width={100} />), 'src')).toBe(WORDMARK_ASSETS.ar.light);
    expect(attr(html(<Wordmark variant="ar" width={100} accent={false} />), 'src')).toBe(WORDMARK_ASSETS.ar.solid);
    expect(WORDMARK_ASSETS.ar.light).not.toBe(WORDMARK_ASSETS.ar.solid);
  });

  it('can be decorative (empty alt) when the name is announced nearby', () => {
    expect(attr(html(<Wordmark variant="bi" width={200} decorative />), 'alt')).toBe('');
  });

  it('is static: no animation or transition, and not shrunk by max-width', () => {
    const m = html(<Wordmark variant="pair" width={200} />);
    expect(m).not.toMatch(/animate|transition|animation/i);
    expect(m).toContain('max-width:none');
    expect(m).toContain('draggable="false"');
  });

  it('keeps accessible names in step with the SVG aria-labels and never uses lowercase "midan"', () => {
    for (const [variant, alt] of Object.entries(WORDMARK_ALT)) {
      const svg = fs.readFileSync(`src/brand/assets/wordmark/midan-wordmark-${variant}-light.svg`, 'utf8');
      expect(svg).toContain(`aria-label="${alt}"`);
      expect(alt).not.toMatch(/midan/);
    }
  });

  it('compact renders the ORIGINAL symbol, not a wordmark', () => {
    const m = html(<Wordmark compact height={32} />);
    expect(m).toContain('data-brand-symbol');
    expect(m).not.toContain('data-wordmark');
    expect(attr(m, 'width')).toBe('32');
  });
});

describe('<BrandSymbol>', () => {
  it('never draws the symbol below 16px', () => {
    expect(attr(html(<BrandSymbol size={8} />), 'width')).toBe(String(SYMBOL_MIN_SIZE));
  });

  it('uses the original symbol file, byte-identical to the recorded brand hash', () => {
    const recorded = fs
      .readFileSync('brand-assets.sha256', 'utf8')
      .split('\n')
      .find((l) => l.includes('src/brand/assets/symbol/midan-mark-light.svg'))!
      .split(/\s{2,}/)[0];
    const actual = createHash('sha256').update(fs.readFileSync('src/brand/assets/symbol/midan-mark-light.svg')).digest('hex');
    expect(actual).toBe(recorded);
  });
});
