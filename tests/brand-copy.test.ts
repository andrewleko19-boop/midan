import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/**
 * Tests the copy/verify LOGIC with synthetic fixture files in a temp folder.
 * These are NOT the real brand assets; verifying the real package happens with `npm run brand:verify`.
 */
const script = path.resolve('scripts/copy-brand-assets.mjs');
const WEB = ['favicon.svg', 'favicon.ico', 'favicon-16.png', 'favicon-32.png', 'favicon-48.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'site.webmanifest'];

let tmp = '';
let pkg = '';

function run(args: string[]) {
  return spawnSync('node', [script, '--root', tmp, '--src', pkg, ...args], { encoding: 'utf8' });
}

beforeAll(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'midan-brand-'));
  pkg = path.join(tmp, 'brand-package');
  const put = (rel: string, body: string | Buffer) => {
    const p = path.join(pkg, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, body);
  };
  for (const f of WEB) put(`web-public/${f}`, f === 'site.webmanifest' ? JSON.stringify({ name: 'old', icons: [{ src: '/icon-192.png', sizes: '192x192' }], theme_color: '#1B2A4E' }) : Buffer.from(`fixture:${f}`));
  put('svg/mark/midan-mark-light.svg', '<svg xmlns="http://www.w3.org/2000/svg"/>');
  for (const v of ['indigo', 'sand', 'maskable']) put(`svg/app-icon/midan-app-icon-${v}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" data-v="${v}"/>`);
});

afterAll(() => fs.rmSync(tmp, { recursive: true, force: true }));

describe('copy-brand-assets (fixture package)', () => {
  it('fails clearly when the package is missing', () => {
    const r = spawnSync('node', [script, '--root', tmp, '--src', path.join(tmp, 'nope')], { encoding: 'utf8' });
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('Brand package not found');
  });

  it('fails verify when nothing was copied yet', () => {
    const r = run(['--verify']);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('brand-assets.sha256 not found');
  });

  it('copies byte for byte and patches only the manifest template fields', () => {
    execFileSync('node', [script, '--root', tmp, '--src', pkg]);
    for (const f of WEB.filter((x) => x !== 'site.webmanifest')) {
      expect(fs.readFileSync(path.join(tmp, 'public', f))).toEqual(fs.readFileSync(path.join(pkg, 'web-public', f)));
    }
    expect(fs.readFileSync(path.join(tmp, 'src/brand/assets/symbol/midan-mark-light.svg'), 'utf8')).toContain('<svg');
    const m = JSON.parse(fs.readFileSync(path.join(tmp, 'public/site.webmanifest'), 'utf8'));
    expect(m.theme_color).toBe('#F4EDE0');
    expect(m.name).toBe('مِيدان · Midan');
    expect(m.icons).toEqual([{ src: 'icon-192.png', sizes: '192x192' }]); // made relative so it works under /<repo>/
    expect(m.lang).toBe('ar');
  });

  it('verifies against the package', () => {
    const r = run(['--verify']);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('AND the original package');
  });

  it('detects a tampered app copy', () => {
    const p = path.join(tmp, 'public/icon-192.png');
    const original = fs.readFileSync(p);
    fs.writeFileSync(p, Buffer.from('tampered'));
    const r = run(['--verify']);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('public/icon-192.png');
    fs.writeFileSync(p, original);
  });

  it('warns (not passes silently) when the package is absent', () => {
    const r = spawnSync('node', [script, '--root', tmp, '--src', path.join(tmp, 'nope'), '--verify'], { encoding: 'utf8' });
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('NOT compared with the originals');
  });
});
