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

## Implementation (Step 2, not started)
Static SVGs exported from the `fin` data in `docs/reference/wordmark-exploration-F1-F6.html`, light variants only (`pair`, `bi`, `ar`, `en`), through `scripts/export-wordmark.mjs`, with a `<Wordmark>` component that enforces minimum sizes (Arabic 40px wide, `pair` 120px wide) and clear space. Mobile header size to be chosen after testing `pair`, `bi`, and `ar` at real sizes. Check the wordmark on Sand and on Surface `#FFFDF8`.
