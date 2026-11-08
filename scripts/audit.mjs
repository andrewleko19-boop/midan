#!/usr/bin/env node
/**
 * Project guard rails (Step 1). Fails if the source or build contains things V1 must not have:
 * dark-theme logic, browser storage, geolocation/camera, network calls, external URLs, animation.
 *
 *   node scripts/audit.mjs          scan src/, index.html, public/
 *   node scripts/audit.mjs --dist   scan dist/ (external URLs and storage APIs only; see DIST_ALLOW)
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const DIST = process.argv.includes('--dist');

const TEXT_EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.css', '.html', '.svg', '.json', '.webmanifest']);

const SOURCE_RULES = [
  ['dark-theme utility (dark:)', /(^|[\s"'`{])dark:/m],
  ['prefers-color-scheme', /prefers-color-scheme/],
  ['browser storage API', /\b(localStorage|sessionStorage|indexedDB|openDatabase)\b|\bcaches\.(open|match)|serviceWorker/],
  ['geolocation / camera / microphone', /navigator\.geolocation|getCurrentPosition|watchPosition|mediaDevices|getUserMedia/],
  ['network call', /\bfetch\s*\(|XMLHttpRequest|new\s+WebSocket|EventSource|sendBeacon/],
  ['external URL', /https?:\/\/(?!www\.w3\.org\/)[^\s"'`)<>]+/],
  ['@keyframes', /@keyframes/],
  ['CSS animation/transition declaration', /(?<![\w-])(animation|transition)(-[a-z-]+)?\s*:(?!\s*none\b)\s*[^;}\n]+/],
  ['animation/transition utility class', /\b(animate-[\w-]+|transition-[\w-]+|duration-\d+|ease-[\w-]+)\b|["'`\s]transition["'`\s]/],
];

// Strings that exist inside framework bundles but are never requested at runtime.
// The Playwright test (e2e/foundation.spec.ts) is the real proof that no request leaves the origin.
const DIST_ALLOW = [
  /^https?:\/\/www\.w3\.org\//, // XML/SVG/MathML namespace identifiers
  /^https:\/\/react\.dev\/errors/, // React production error-message URL strings (text only)
];
const DIST_RULES = [
  ['external URL', /https?:\/\/[^\s"'`)<>\\]+/g, DIST_ALLOW],
  ['browser storage API', /\b(localStorage|sessionStorage|indexedDB)\b/, []],
  ['geolocation / camera', /navigator\.geolocation|getUserMedia/, []],
];

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (TEXT_EXT.has(path.extname(e.name))) yield p;
  }
}

const targets = DIST
  ? [...walk(path.join(ROOT, 'dist'))]
  : [...walk(path.join(ROOT, 'src')), path.join(ROOT, 'index.html'), ...walk(path.join(ROOT, 'public'))].filter((p) => fs.existsSync(p));

if (DIST && targets.length === 0) {
  console.error('✘ dist/ is empty. Run "npm run build" first.');
  process.exit(1);
}

const findings = [];
for (const file of targets) {
  const raw = fs.readFileSync(file, 'utf8');
  // Block comments are documentation, not behavior; blank them but keep line numbers stable.
  const text = DIST ? raw : raw.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  const rel = path.relative(ROOT, file);
  if (DIST) {
    for (const [label, re, allow] of DIST_RULES) {
      const flags = re.flags.includes('g') ? re.flags : `${re.flags}g`;
      for (const m of text.matchAll(new RegExp(re.source, flags))) {
        if (!allow.some((a) => a.test(m[0]))) findings.push(`${rel}: ${label}: ${m[0].slice(0, 90)}`);
      }
    }
  } else {
    text.split('\n').forEach((line, i) => {
      for (const [label, re] of SOURCE_RULES) {
        if (re.test(line)) findings.push(`${rel}:${i + 1}: ${label}: ${line.trim().slice(0, 90)}`);
      }
    });
  }
}

if (findings.length) {
  console.error(`✘ audit${DIST ? ' (dist)' : ''} found ${findings.length} problem(s):\n  ${findings.join('\n  ')}`);
  process.exit(1);
}
console.log(`✔ audit${DIST ? ' (dist)' : ''} clean — ${targets.length} files scanned.`);
