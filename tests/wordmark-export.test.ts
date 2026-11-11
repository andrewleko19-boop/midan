import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const repo = path.resolve('.');
const script = path.join(repo, 'scripts/export-wordmark.mjs');
const SVG_DIR = 'src/brand/assets/wordmark';
const INK = '#0E3A5F';
const ACCENT = '#1F5FA8';
const KINDS = ['pair', 'bi', 'ar', 'en'] as const;
const MODES = ['light', 'solid'] as const;

const read = (rel: string, root = repo) => fs.readFileSync(path.join(root, rel), 'utf8');
const run = (root: string, ...extra: string[]) => spawnSync('node', [script, '--root', root, ...extra], { encoding: 'utf8' });

describe('exported wordmark SVGs', () => {
  for (const kind of KINDS) {
    for (const mode of MODES) {
      const rel = `${SVG_DIR}/midan-wordmark-${kind}-${mode}.svg`;
      const svg = read(rel);

      it(`${kind}/${mode}: plain, accessible, correctly spelled`, () => {
        expect(svg).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 [\d.]+ [\d.]+"/);
        expect(svg).toContain('role="img"');
        expect(svg).toMatch(/aria-label="[^"]+"/);
        expect(svg).not.toMatch(/<text|<image|<script|href=|url\(|<style|<animate|<set /);
        expect(svg).not.toMatch(/midan/); // the English wordmark is "Midan", never lowercase
        if (kind === 'en') expect(svg).toContain('aria-label="Midan"');
        if (kind === 'ar') expect(svg).toContain('aria-label="مِيدان"'); // kasra (U+0650) preserved
        if (kind === 'pair' || kind === 'bi') expect(svg).toContain('aria-label="مِيدان Midan"');
      });

      it(`${kind}/${mode}: uses only the approved colors`, () => {
        const fills = new Set([...svg.matchAll(/fill="([^"]+)"/g)].map((m) => m[1]));
        expect(fills.has(INK)).toBe(true);
        expect(fills.has(ACCENT)).toBe(mode === 'light');
        for (const f of fills) expect([INK, ACCENT]).toContain(f);
      });
    }
  }

  it('keeps viewBox and generated aspect ratios in step', () => {
    const generated = read('src/brand/wordmark.generated.ts');
    for (const kind of KINDS) {
      const vb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(read(`${SVG_DIR}/midan-wordmark-${kind}-light.svg`))!;
      const aspect = Number(vb[1]) / Number(vb[2]);
      const m = new RegExp(`${kind}: \\{[^}]*aspect: ([\\d.]+)`).exec(generated)!;
      expect(Number(m[1])).toBeCloseTo(aspect, 5);
    }
  });
});

describe('export-wordmark script', () => {
  it('matches a fresh export of the reference (npm run wordmark:verify)', () => {
    const r = run(repo, '--verify');
    expect(r.status, r.stderr).toBe(0);
    expect(r.stdout).toContain('9 wordmark files match');
  });

  describe('guards against hand edits (temp copy of the repo files)', () => {
    let tmp = '';
    beforeAll(() => {
      tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'midan-wm-'));
      fs.mkdirSync(path.join(tmp, 'docs/reference'), { recursive: true });
      fs.copyFileSync(path.join(repo, 'docs/reference/wordmark-exploration-F1-F6.html'), path.join(tmp, 'docs/reference/wordmark-exploration-F1-F6.html'));
      expect(run(tmp).status).toBe(0); // fresh export into the temp root
    });
    afterAll(() => fs.rmSync(tmp, { recursive: true, force: true }));

    it('a fresh export is byte-identical to the committed files', () => {
      for (const kind of KINDS) for (const mode of MODES) {
        const rel = `${SVG_DIR}/midan-wordmark-${kind}-${mode}.svg`;
        expect(read(rel, tmp)).toBe(read(rel));
      }
      expect(read('src/brand/wordmark.generated.ts', tmp)).toBe(read('src/brand/wordmark.generated.ts'));
    });

    it('detects an edited file, a missing file, and a stray file', () => {
      const f = path.join(tmp, `${SVG_DIR}/midan-wordmark-ar-light.svg`);
      const original = fs.readFileSync(f);
      fs.writeFileSync(f, original.toString('utf8').replace(INK, '#000000'));
      let r = run(tmp, '--verify');
      expect(r.status).toBe(1);
      expect(r.stderr).toContain('midan-wordmark-ar-light.svg');
      fs.writeFileSync(f, original);

      fs.rmSync(f);
      r = run(tmp, '--verify');
      expect(r.status).toBe(1);
      expect(r.stderr).toContain('missing');
      fs.writeFileSync(f, original);

      const stray = path.join(tmp, `${SVG_DIR}/hand-made.svg`);
      fs.writeFileSync(stray, '<svg/>');
      r = run(tmp, '--verify');
      expect(r.status).toBe(1);
      expect(r.stderr).toContain('hand-made.svg');
      fs.rmSync(stray);
      expect(run(tmp, '--verify').status).toBe(0);
    });
  });
});
