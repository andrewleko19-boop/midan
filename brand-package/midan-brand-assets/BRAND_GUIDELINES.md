# مِيدان · midan — Brand guidelines

Approved identity. Do not alter the symbol, the wordmarks, the palette or the typography.

## 1. Concept
**Rising Routes.** *Two routes. One shared direction.* · *مساران، ووجهة واحدة.*
The symbol is an M built from two separate routes. A deep indigo route on the left and a teal route on the right both rise from the ground and converge on one small copper node in the central valley. The right route is taller than the left: work moves from a task toward completion. It stands for field movement, coordination, progress, and the link between people and places.

## 2. Originality
The M is drawn from straight stems and diagonal strokes meeting in a valley, with an asymmetric rise and a node at the meeting point. It uses no arches. It does not use symmetrical rounded arches, a merged silhouette, or yellow-and-red, which are the traits that define the McDonald's Golden Arches.
This is a design comparison, not legal advice. No trademark clearance search has been run; do one before public launch.

## 3. Name and wordmarks
| | Form | Rules |
|---|---|---|
| Arabic | **مِيدان** (with kasra, U+0650) | Primary in Arabic contexts. Never retype it in another font. |
| English | **midan** | Always lowercase, including at the start of a sentence in logo use. |
Both wordmarks are outlined vector paths in Readex Pro SemiBold. In running text you may write مِيدان or ميدان, but always `midan` in lowercase.

## 4. Logo family
| Asset | Content | Use |
|---|---|---|
| Primary | Symbol + Arabic, English beneath (Arabic-first) | Default everywhere there is room |
| Arabic | Symbol + مِيدان | Arabic-only interfaces and documents |
| English | Symbol + midan | English-only interfaces and documents |
| Bilingual | Symbol + مِيدان \| midan on one line | Headers and tight horizontal spaces |
| Wordmarks | مِيدان, midan, or stacked, no symbol | When the symbol already appears nearby |
| Symbol | The M alone | Avatars, loading and sync indicators, small spaces |
| App icon / favicon | Symbol on an indigo (or sand) rounded tile | Launcher, tab, home screen |
| Stickers | Die-cut and round badge | Physical and promotional use |

Reading direction: Arabic and bilingual lockups place the symbol on the **right** (the start edge in RTL); the English lockup places it on the left. Never mirror a finished lockup.

## 5. Colour
| Name | HEX | RGB | Role |
|---|---|---|---|
| Indigo | `#1B2A4E` | 27 · 42 · 78 | Wordmark, left route, text, app-icon tile |
| Teal | `#1F7A6F` | 31 · 122 · 111 | Right route |
| Copper | `#BF7129` | 191 · 113 · 41 | The node only. Never large areas or body text |
| Sand | `#F4EDE0` | 244 · 237 · 224 | Light surface |
| Night | `#0F1730` | 15 · 23 · 48 | Dark surface |

On dark surfaces the logo uses the same hues retuned for contrast, only inside the dark logo files: Teal Light `#4DBFAA` and Copper Light `#E39A4F`, with Sand for the left route and wordmark. Tokens: `tokens/midan-colors.css` and `.json`.

## 6. Typography
- **Readex Pro** (SIL Open Font License 1.1), one family for Arabic and Latin. Licence text: `fonts/OFL-ReadexPro.txt`.
- Logo: outlined SemiBold (600). No font is needed to display any logo file.
- Product headings, Arabic and English: Readex Pro 600. Body: Readex Pro 400/500, or the system UI font. Only weight 600 is bundled; get other weights from Google Fonts or `@fontsource/readex-pro`.
- Fallback stack: `"Readex Pro", system-ui, "Segoe UI", Tahoma, sans-serif`.
- Do not letter-space Arabic. Keep Arabic and Latin at the same weight when they sit together.

## 7. Clear space
Keep a margin of **x** on all sides, where **x = the width of one stem of the M = 17.7 % of the symbol height**. In every lockup the symbol height equals the lockup height, so x = 0.177 × lockup height (a 64 px-tall lockup needs 11 px; a 40 px one needs 7 px). SVG files are cropped tight with no built-in margin. Stickers: leave 5 mm around the printed edge.

## 8. Recommended and minimum sizes
Heights are the height of the whole logo (equal to symbol height).
| Asset | Minimum | Recommended |
|---|---|---|
| Symbol | 16 px · 5 mm | 32–40 px UI, 64–96 px splash/login |
| Arabic or English lockup | 24 px · 8 mm | 32–40 px header, 64–96 px hero |
| Primary (stacked) | 40 px · 12 mm | 56–96 px |
| Bilingual one-line | 28 px · 9 mm | 32–40 px |
| Wordmark only | 24 px · 8 mm | 28–48 px |
| Favicon | 16 px | ship 16, 32, 48 + SVG |
| App icon | 48 px | source 1024 px |
| Sticker | 40 mm | 50–80 mm |
Below a minimum, switch to the symbol.

## 9. Backgrounds
| Background | File suffix | Contrast of marks on it |
|---|---|---|
| White, Sand `#F4EDE0`, light tints | `-light` | Indigo 12.1:1 on Sand (14.1:1 on white), Teal 4.4:1 (5.2:1), Copper 3.2:1 (3.7:1) |
| Night `#0F1730`, Indigo `#1B2A4E` | `-dark` | Sand 15.2:1 on Night (12.1:1 on Indigo), Teal Light 7.9:1 (6.3:1), Copper Light 7.6:1 (6.1:1) |
| One-colour print, stamps, engraving, fax, photos, busy or off-palette colour | `-mono-black` / `-mono-white` | Pick the one with more contrast; use black on light, white on dark |
Do not place the light logo on Teal, Copper or Indigo (Indigo on Teal is only 2.7:1), or the dark logo on light surfaces. On photographs, use a mono version over a calm area or a solid panel. Copper is below 4.5:1 on light surfaces, so it is acceptable only as a graphic, never as text.

## 10. Approved uses
- Any shipped file on the background it is named for, at or above minimum size, with clear space.
- Symbol alone as avatar, favicon, loading mark, sync indicator.
- Arabic lockup in Arabic UI and documents, English lockup in English, primary or bilingual where both appear.
- One-colour versions for stamps, uniforms, embroidery, receipts.

## 11. Incorrect uses
Do not: recolour the routes · swap which route is teal or indigo · change the node colour or replace it with a pin or checkmark · stretch, skew, rotate or outline · add shadows, glows or gradients to logos (the sticker shadow is part of the sticker) · retype the wordmarks · capitalise *midan* · drop the kasra from the Arabic logo · crop the symbol · put the light logo on dark or low-contrast backgrounds · place the symbol on the wrong side in a lockup · combine the symbol with other shapes inside a new emblem · animate the symbol decoratively.

## 12. Stickers
Two forms, each in light, dark and monochrome: **die-cut** (the M with a white border that follows its contour) and **round badge** (symbol plus Arabic wordmark inside a circle with a white rim). Light = sand surface or white border; dark = Night/indigo surface. Monochrome uses Night ink on white. Use on laptops, notebooks, helmets, field kit, phones, bottles. Keep the border and soft shadow; never add cartoon outlines or extra text. The SVG shadow uses a standard filter. For print, supply the outermost border shape as the cut path (no separate cut file is included).

## 13. Motion (reference for later digital use)
Not part of the asset files. When the symbol is animated in a future product: routes draw upward from the ground (about 340 ms each, right 90 ms later), the copper node lands as they converge (220 ms), wordmarks fade in (260 ms); total about 520 ms, once. Loading builds slowly and never spins. Sync sends a highlight along both routes into the node. All motion must stop under `prefers-reduced-motion: reduce`. A reference implementation is in `source/brand-components/`.
