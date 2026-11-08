#!/usr/bin/env node
/**
 * Copies the approved brand artwork from brand-package/ into the app, byte for byte,
 * and records SHA-256 hashes in brand-assets.sha256.
 *
 *   node scripts/copy-brand-assets.mjs            copy + record hashes
 *   node scripts/copy-brand-assets.mjs --verify   check hashes (and the source package, if present)
 *
 * Options: --src <dir> (default: brand-package)   --root <dir> (default: cwd)
 *
 * The ONLY file that is changed is public/site.webmanifest (template for the real app).
 * Only the fields in MANIFEST_PATCH are touched; icons and everything else are preserved.
 * No artwork (SVG/PNG/ICO) is ever modified.
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const ROOT = path.resolve(opt('--root', process.cwd()));
const SRC_ARG = path.resolve(ROOT, opt('--src', 'brand-package'));
const HASH_FILE = path.join(ROOT, 'brand-assets.sha256');
const VERIFY = flag('--verify');

const WEB = ['favicon.svg', 'favicon.ico', 'favicon-16.png', 'favicon-32.png', 'favicon-48.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'site.webmanifest'];
const SYMBOL_DIR = 'src/brand/assets/symbol';
/** [source path inside the package, destination path inside the app] */
const WHITELIST = [
  ...WEB.map((f) => [`web-public/${f}`, `public/${f}`]),
  ['svg/mark/midan-mark-light.svg', `${SYMBOL_DIR}/midan-mark-light.svg`],
  ['svg/app-icon/midan-app-icon-indigo.svg', `${SYMBOL_DIR}/midan-app-icon-indigo.svg`],
  ['svg/app-icon/midan-app-icon-sand.svg', `${SYMBOL_DIR}/midan-app-icon-sand.svg`],
  ['svg/app-icon/midan-app-icon-maskable.svg', `${SYMBOL_DIR}/midan-app-icon-maskable.svg`],
];
const MANIFEST_DEST = 'public/site.webmanifest';
const MANIFEST_PATCH = {
  name: 'مِيدان · Midan',
  short_name: 'مِيدان',
  start_url: '/',
  theme_color: '#F4EDE0',
  background_color: '#F4EDE0',
};
const MANIFEST_ADD_IF_ABSENT = { lang: 'ar', dir: 'rtl' };

const sha = (buf) => createHash('sha256').update(buf).digest('hex');
const fail = (msg) => {
  console.error(`✘ ${msg}`);
  process.exit(1);
};

function findPackageRoot(dir) {
  const isRoot = (d) => fs.existsSync(path.join(d, 'web-public')) && fs.existsSync(path.join(d, 'svg'));
  if (!fs.existsSync(dir)) return null;
  if (isRoot(dir)) return dir;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory() && isRoot(path.join(dir, e.name))) return path.join(dir, e.name);
  }
  return null;
}

function patchManifest(buf) {
  let json;
  try {
    json = JSON.parse(buf.toString('utf8'));
  } catch (e) {
    fail(`site.webmanifest in the package is not valid JSON: ${e.message}`);
  }
  const patched = { ...json };
  const changes = [];
  for (const [k, v] of Object.entries(MANIFEST_PATCH)) {
    if (patched[k] !== v) changes.push(`${k}: ${JSON.stringify(json[k])} -> ${JSON.stringify(v)}`);
    patched[k] = v;
  }
  for (const [k, v] of Object.entries(MANIFEST_ADD_IF_ABSENT)) {
    if (!(k in patched)) {
      patched[k] = v;
      changes.push(`${k}: (absent) -> ${JSON.stringify(v)}`);
    }
  }
  return { out: Buffer.from(`${JSON.stringify(patched, null, 2)}\n`, 'utf8'), changes };
}

function manifestOnlyAllowedFieldsChanged(srcBuf, destBuf) {
  const a = JSON.parse(srcBuf.toString('utf8'));
  const b = JSON.parse(destBuf.toString('utf8'));
  const allowed = new Set([...Object.keys(MANIFEST_PATCH), ...Object.keys(MANIFEST_ADD_IF_ABSENT)]);
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (allowed.has(k)) continue;
    if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) return `field "${k}" differs`;
  }
  return null;
}

function writeHashFile(lines) {
  const header = [
    '# Midan brand assets — SHA-256 of the files shipped in this app.',
    '# Format: <sha256>  <destination>  source=<path inside brand package>  [patched source-sha256=<hash>]',
    '# Everything is a byte-for-byte copy except public/site.webmanifest (template text fields only).',
  ];
  fs.writeFileSync(HASH_FILE, `${[...header, ...lines].join('\n')}\n`);
}

function readHashFile() {
  if (!fs.existsSync(HASH_FILE)) return null;
  const rows = new Map();
  for (const line of fs.readFileSync(HASH_FILE, 'utf8').split('\n')) {
    if (!line.trim() || line.startsWith('#')) continue;
    const [hash, dest, ...rest] = line.trim().split(/\s{2,}/);
    const meta = rest.join('  ');
    const source = /source=(\S+)/.exec(meta)?.[1];
    const sourceHash = /source-sha256=([0-9a-f]{64})/.exec(meta)?.[1];
    rows.set(dest, { hash, source, sourceHash, patched: meta.includes('patched') });
  }
  return rows;
}

if (!VERIFY) {
  const pkg = findPackageRoot(SRC_ARG);
  if (!pkg) fail(`Brand package not found at "${SRC_ARG}". Place the contents of midan-brand-assets.zip there (it must contain web-public/ and svg/).`);
  const missing = WHITELIST.filter(([s]) => !fs.existsSync(path.join(pkg, s)));
  if (missing.length) fail(`Missing in package:\n  ${missing.map(([s]) => s).join('\n  ')}`);

  const lines = [];
  for (const [srcRel, destRel] of WHITELIST) {
    const srcBuf = fs.readFileSync(path.join(pkg, srcRel));
    const dest = path.join(ROOT, destRel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (destRel === MANIFEST_DEST) {
      const { out, changes } = patchManifest(srcBuf);
      fs.writeFileSync(dest, out);
      console.log(`• ${destRel} (patched template fields)\n    ${changes.length ? changes.join('\n    ') : 'no field needed changing'}`);
      lines.push(`${sha(out)}  ${destRel}  source=${srcRel}  patched source-sha256=${sha(srcBuf)}`);
    } else {
      fs.writeFileSync(dest, srcBuf);
      lines.push(`${sha(srcBuf)}  ${destRel}  source=${srcRel}`);
    }
  }
  writeHashFile(lines);
  console.log(`✔ Copied ${WHITELIST.length} files and wrote ${path.relative(ROOT, HASH_FILE)}`);
  process.exit(0);
}

// ---- verify ----
const rows = readHashFile();
if (!rows) fail('brand-assets.sha256 not found. Run "npm run brand:copy" with the brand package in place first.');
const problems = [];
const pkg = findPackageRoot(SRC_ARG);

for (const [, destRel] of WHITELIST) {
  const row = rows.get(destRel);
  const dest = path.join(ROOT, destRel);
  if (!row) {
    problems.push(`${destRel}: not recorded in brand-assets.sha256`);
    continue;
  }
  if (!fs.existsSync(dest)) {
    problems.push(`${destRel}: file is missing`);
    continue;
  }
  const destBuf = fs.readFileSync(dest);
  if (sha(destBuf) !== row.hash) problems.push(`${destRel}: content differs from the recorded hash`);
  if (pkg && row.source) {
    const srcPath = path.join(pkg, row.source);
    if (!fs.existsSync(srcPath)) {
      problems.push(`${row.source}: missing in the brand package`);
      continue;
    }
    const srcBuf = fs.readFileSync(srcPath);
    if (row.patched) {
      if (sha(srcBuf) !== row.sourceHash) problems.push(`${row.source}: package file changed since the copy`);
      const why = manifestOnlyAllowedFieldsChanged(srcBuf, destBuf);
      if (why) problems.push(`${destRel}: patch touched more than the allowed template fields (${why})`);
    } else if (sha(srcBuf) !== sha(destBuf)) {
      problems.push(`${destRel}: differs from the original in the brand package`);
    }
  }
}

if (problems.length) {
  console.error(`✘ Brand asset verification failed:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(
  pkg
    ? `✔ ${WHITELIST.length} brand files verified against the recorded hashes AND the original package.`
    : `⚠ ${WHITELIST.length} files match the recorded hashes, but the brand package is not present, so they were NOT compared with the originals.`,
);
