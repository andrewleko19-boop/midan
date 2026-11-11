# Wordmark notes

## Decision [C]
- The product uses a **static bilingual wordmark**: **مِيدان** (with the kasra) above **Midan** (capital M, then lowercase i, d, a, n), Arabic-first.
- Selected combination from the F1–F6 reference: Arabic R2 (Direction), English E2 (Medium), kasra K2, i-dot D2.
- Colors: `#0E3A5F`, optional accent `#1F5FA8` (kasra and i-dot only). These are separate from the product UI palette.
- Use it in the app header, desktop navigation, mobile header, and other surfaces that need the brand.
- Light variants only, on Sand or white. No dark or reversed wordmark in V1.
- The provisional descriptor (تنسيق العمل الميداني / Field operations, organized) is not shown in V1 chrome.

## The original M symbol and app icon [C]
- Unchanged and separate. Used only for the app icon, the favicon, and compact spaces where the full wordmark cannot fit.
- Never a replacement for the wordmark. Not a loading indicator. No animation, no splash, no M-to-Midan transition.
- The capital M in "Midan" is a typographic letter, not the symbol.

## What this supersedes in `BRAND_GUIDELINES.md`
- "English wordmark is always lowercase `midan`": for the **new text wordmark** it is `Midan`. The legacy lockups that contain the symbol keep lowercase `midan` and stay unchanged.
- "Symbol as loading or sync indicator": not used in V1.

## Implementation (Step 2, done)
- `scripts/export-wordmark.mjs` runs the reference file's own `wm()` (via `scripts/lib/reference-wordmark.mjs`) and writes 8 SVGs to `src/brand/assets/wordmark/` plus `src/brand/wordmark.generated.ts`. Nothing is redrawn. Never edit these files by hand: change the reference and run `npm run wordmark:export`. `npm run wordmark:verify` (part of `npm run check`) fails on any hand edit, missing file, or stray file.
- Variants: `pair` (مِيدان above Midan, primary), `bi` (one line), `ar`, `en`. Each in `light` (ink `#0E3A5F` + accent `#1F5FA8` on the kasra and i-dot) and `solid` (ink only; the accent is optional).
- `<Wordmark variant width|height accent decorative compact />` in `src/brand/Wordmark.tsx`. Static: no animation, no transition. Never mirrored, stretched, recolored, outlined, or shadowed.
- `compact` renders the original M symbol through `<BrandSymbol>` (the unmodified `midan-mark-light.svg`, never below 16px).

| Variant | Aspect (w:h) | Min width [A] | Height at min | Notes |
|---|---|---|---|---|
| `pair` | 1.259 | 120px | 95px | Nearly square: too tall for a 54px mobile header |
| `bi` | 4.678 | 110px | 23.5px | 28px tall = 131px wide |
| `ar` | 2.069 | 40px | 19.3px | 30px tall = 62px wide |
| `en` | 3.433 | 56px | 16.3px | |

## Fidelity to the reference (measured)
- The SVG inner markup is byte-identical to the reference's own `wm()` output for all four compositions.
- Rendered inline in Chromium, the exported SVG is pixel-identical to the reference.
- Rendered as `<img>` (how the app uses it), only anti-aliased edges differ: ink area within 0.15%, no geometric shift, mean difference at most 1.9/255 over ink pixels.
- Two deliberate changes to the reference output: `xmlns` is added (required for `<img>`), and `aria-label` says `Midan` (the reference said lowercase `midan`).

## Still open
- **Mobile header:** `pair` does not fit a 54px bar. Candidates: `bi` at about 28px tall or `ar` at about 30px tall. Owner decision, to be applied in Step 5.
- **Clear space:** F1–F6 define none. The older exploration said "the height of the alef". Not enforced by the component; decide with the header in Step 5.
- **Minimum widths** are provisional. In the lab the kasra and i-dot are marginal at 40px (Arabic) and lose definition at 28px.
- Check the wordmark on a real phone before locking sizes.
