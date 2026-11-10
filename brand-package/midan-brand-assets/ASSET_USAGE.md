# مِيدان · midan — Asset usage

Final brand asset package. It contains artwork only: no application, no demo screens, nothing integrated. Brand rules are in `BRAND_GUIDELINES.md`.

## 1. What is in the package

| Folder | What it is |
|---|---|
| `svg/` | Master vector artwork. Use SVG wherever possible. |
| `png/` | Transparent PNG exports of the SVGs, for tools that cannot use SVG (slides, email, docs). |
| `web-public/` | Ready-to-copy favicon, touch icon and manifest icons for a web app's `public/` folder. |
| `tokens/` | Brand colours as CSS variables and JSON. |
| `fonts/` | Readex Pro SemiBold (Arabic and Latin subsets, woff2) and its SIL OFL licence. |
| `source/` | Optional. Wordmark outlining script and the React logo components (static, animated, app icon). |
| `preview/` | One overview image of the whole set. |

### Naming
`midan-<asset>-<variant>[-<size>].<ext>`. Variants: `light` (for light backgrounds), `dark` (for dark backgrounds), `mono-black`, `mono-white`. PNG sizes are the pixel width, except marks, icons and stickers where the number is the pixel size of the image.

### SVG assets (`svg/`)
| Folder | Files | Description |
|---|---|---|
| `logo-primary/` | `midan-logo-primary-{light,dark,mono-black,mono-white}.svg` | Primary full logo: symbol + مِيدان with midan beneath. Default choice. |
| `logo-arabic/` | `midan-logo-arabic-…` | Symbol + مِيدان (symbol on the right). |
| `logo-english/` | `midan-logo-english-…` | Symbol + midan (symbol on the left). |
| `logo-bilingual/` | `midan-logo-bilingual-…` | One-line symbol + مِيدان \| midan. |
| `wordmark/` | `midan-wordmark-{arabic,english,stacked}-…` | Wordmarks without the symbol. |
| `mark/` | `midan-mark-…` | The Rising Routes M alone. |
| `app-icon/` | `midan-app-icon-{indigo,sand,maskable}.svg` | Rounded-square icons; `maskable` is full-bleed with a safe zone for OS masking. |
| `favicon/` | `midan-favicon.svg` | Favicon artwork (indigo tile). |
| `sticker/` | `midan-sticker-{diecut,badge}-{light,dark,mono}.svg` | Six stickers. Die-cut = M with white contour border. Badge = round, symbol + مِيدان. Shadow is built in. |

All SVGs are plain vector paths: no embedded raster, no text, no scripts, no external references, no font needed. They carry `role="img"` and an `aria-label`. IDs are unique per file, so several SVGs can be inlined in one page.

### PNG assets (`png/`)
Same folder names as `svg/`, transparent backgrounds. Logos and wordmarks: 1200 px wide. Marks: 256, 512, 1024. Stickers: 512, 1024 (shadow included). App icons: 1024, 512, 192 (rounded, transparent corners); maskable 512 (opaque). Favicon: 16, 32, 48, 64, 180.
Mono PNGs are black or white on transparent: preview them on a contrasting background.

### Web set (`web-public/`)
`favicon.svg`, `favicon.ico` (16/32/48), `favicon-16/32/48.png`, `apple-touch-icon.png` (180, opaque), `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `site.webmanifest`.

## 2. Copy into a future React project

Pick the layout that matches your tooling. Paths below assume a Vite/CRA-style project root.

```bash
# 1. static web assets (served from "/")
cp midan-brand-assets/web-public/* my-app/public/

# 2. brand artwork, served by URL
mkdir -p my-app/public/brand && cp -r midan-brand-assets/svg my-app/public/brand/svg

# 3. fonts and tokens
cp -r midan-brand-assets/fonts my-app/public/fonts
cp midan-brand-assets/tokens/midan-colors.css my-app/src/styles/
```
(Copy `png/` only if you need it in the app; it is large.)

### `index.html`
```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/favicon.ico" sizes="48x48" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="#1B2A4E" />
```
Edit `site.webmanifest` (`name`, `start_url`) for the real app.

### Show a logo
```tsx
// by URL (copied to public/brand)
<img src="/brand/svg/logo-arabic/midan-logo-arabic-light.svg" alt="مِيدان" height={40} />

// or imported (bundler turns it into a URL)
import logo from "./assets/brand/midan-logo-bilingual-light.svg";
<img src={logo} alt="مِيدان midan" height={32} />
```
Set `height` and let width follow. Keep clear space of 0.177 × height around it (`padding: 0.177em`-style, or margin). Use `alt=""` when the name is already announced next to the logo.

### Light and dark
```tsx
<picture>
  <source media="(prefers-color-scheme: dark)" srcSet="/brand/svg/logo-primary/midan-logo-primary-dark.svg" />
  <img src="/brand/svg/logo-primary/midan-logo-primary-light.svg" alt="مِيدان midan" height={64} />
</picture>
```
If the app has its own theme toggle instead of following the OS, choose the file from your theme state: `theme === "dark" ? darkSrc : lightSrc`.

### One colour that follows the text colour
The mono files are fixed black or white. To tint them with `currentColor`:
```css
.logo-mono { width: 160px; aspect-ratio: 1; background: currentColor;
  -webkit-mask: url(/brand/svg/mark/midan-mark-mono-black.svg) center / contain no-repeat;
          mask: url(/brand/svg/mark/midan-mark-mono-black.svg) center / contain no-repeat; }
```
Or use the optional components below with `theme="monochrome"`.

### Inline SVG (when you need it)
With Vite + `vite-plugin-svgr`: `import Mark from "./midan-mark-light.svg?react"`. Inline only when you must style it; the colours are fixed by the brand.

### RTL
The lockups are already laid out for their language (symbol at the start edge). Do not flip them with `transform: scaleX(-1)` or `dir`. In a flex header, put the logo first in the DOM; under `dir="rtl"` it lands on the right automatically.

### Fonts and colours
```css
@font-face { font-family: "Readex Pro"; font-weight: 600; font-display: swap;
  src: url(/fonts/readex-pro-arabic-600-normal.woff2) format("woff2");
  unicode-range: U+0600-06FF, U+0750-077F, U+FB50-FDFF, U+FE70-FEFF; }
@font-face { font-family: "Readex Pro"; font-weight: 600; font-display: swap;
  src: url(/fonts/readex-pro-latin-600-normal.woff2) format("woff2");
  unicode-range: U+0000-00FF, U+2000-206F; }
body { font-family: "Readex Pro", system-ui, "Segoe UI", Tahoma, sans-serif; color: var(--midan-indigo); background: var(--midan-sand); }
```
Logo files do not need the font. Import `midan-colors.css` once, e.g. in `main.tsx`: `import "./styles/midan-colors.css";`.

### Optional: React components (`source/brand-components/`)
Only if you want the logo as components, with the entrance, loading and sync animations and `prefers-reduced-motion` support. React 18; the project needs `resolveJsonModule`.
```bash
cp -r midan-brand-assets/source/brand-components my-app/src/brand
```
```tsx
import { Logo, LogoMark, AnimatedLogo, AppIcon } from "./brand";
<Logo language="ar" size="md" />
<Logo language="both" variant="compact" theme="dark" />
<AnimatedLogo state="loading" variant="mark" size="lg" />   // enter | loading | sync | idle
```
Props: `variant` full|compact|mark · `language` ar|en|both · `theme` light|dark|monochrome · `size` sm|md|lg or `height` · `interactive` · `decorative`. These components are not included in any app; they are the reference implementation.

### Regenerating
`source/make-glyphs.py` re-outlines the two wordmarks from the fonts in `fonts/` (needs `fonttools brotli uharfbuzz`). The script that regenerates the whole SVG/PNG set from the components lives in the brand project, not in this package; change the artwork there, not by hand-editing the SVGs.

## 3. Complete file tree
```
midan-brand-assets/
├── fonts/
│   ├── OFL-ReadexPro.txt
│   ├── readex-pro-arabic-600-normal.woff2
│   └── readex-pro-latin-600-normal.woff2
├── png/
│   ├── app-icon/
│   │   ├── midan-app-icon-indigo-1024.png
│   │   ├── midan-app-icon-indigo-192.png
│   │   ├── midan-app-icon-indigo-512.png
│   │   ├── midan-app-icon-maskable-512.png
│   │   ├── midan-app-icon-sand-1024.png
│   │   ├── midan-app-icon-sand-192.png
│   │   └── midan-app-icon-sand-512.png
│   ├── favicon/
│   │   ├── midan-favicon-16.png
│   │   ├── midan-favicon-180.png
│   │   ├── midan-favicon-32.png
│   │   ├── midan-favicon-48.png
│   │   └── midan-favicon-64.png
│   ├── logo-arabic/
│   │   ├── midan-logo-arabic-dark-1200.png
│   │   ├── midan-logo-arabic-light-1200.png
│   │   ├── midan-logo-arabic-mono-black-1200.png
│   │   └── midan-logo-arabic-mono-white-1200.png
│   ├── logo-bilingual/
│   │   ├── midan-logo-bilingual-dark-1200.png
│   │   ├── midan-logo-bilingual-light-1200.png
│   │   ├── midan-logo-bilingual-mono-black-1200.png
│   │   └── midan-logo-bilingual-mono-white-1200.png
│   ├── logo-english/
│   │   ├── midan-logo-english-dark-1200.png
│   │   ├── midan-logo-english-light-1200.png
│   │   ├── midan-logo-english-mono-black-1200.png
│   │   └── midan-logo-english-mono-white-1200.png
│   ├── logo-primary/
│   │   ├── midan-logo-primary-dark-1200.png
│   │   ├── midan-logo-primary-light-1200.png
│   │   ├── midan-logo-primary-mono-black-1200.png
│   │   └── midan-logo-primary-mono-white-1200.png
│   ├── mark/
│   │   ├── midan-mark-dark-1024.png
│   │   ├── midan-mark-dark-256.png
│   │   ├── midan-mark-dark-512.png
│   │   ├── midan-mark-light-1024.png
│   │   ├── midan-mark-light-256.png
│   │   ├── midan-mark-light-512.png
│   │   ├── midan-mark-mono-black-1024.png
│   │   ├── midan-mark-mono-black-256.png
│   │   ├── midan-mark-mono-black-512.png
│   │   ├── midan-mark-mono-white-1024.png
│   │   ├── midan-mark-mono-white-256.png
│   │   └── midan-mark-mono-white-512.png
│   ├── sticker/
│   │   ├── midan-sticker-badge-dark-1024.png
│   │   ├── midan-sticker-badge-dark-512.png
│   │   ├── midan-sticker-badge-light-1024.png
│   │   ├── midan-sticker-badge-light-512.png
│   │   ├── midan-sticker-badge-mono-1024.png
│   │   ├── midan-sticker-badge-mono-512.png
│   │   ├── midan-sticker-diecut-dark-1024.png
│   │   ├── midan-sticker-diecut-dark-512.png
│   │   ├── midan-sticker-diecut-light-1024.png
│   │   ├── midan-sticker-diecut-light-512.png
│   │   ├── midan-sticker-diecut-mono-1024.png
│   │   └── midan-sticker-diecut-mono-512.png
│   └── wordmark/
│       ├── midan-wordmark-arabic-dark-1200.png
│       ├── midan-wordmark-arabic-light-1200.png
│       ├── midan-wordmark-arabic-mono-black-1200.png
│       ├── midan-wordmark-arabic-mono-white-1200.png
│       ├── midan-wordmark-english-dark-1200.png
│       ├── midan-wordmark-english-light-1200.png
│       ├── midan-wordmark-english-mono-black-1200.png
│       ├── midan-wordmark-english-mono-white-1200.png
│       ├── midan-wordmark-stacked-dark-1200.png
│       ├── midan-wordmark-stacked-light-1200.png
│       ├── midan-wordmark-stacked-mono-black-1200.png
│       └── midan-wordmark-stacked-mono-white-1200.png
├── preview/
│   └── midan-assets-overview.png
├── source/
│   ├── brand-components/
│   │   ├── AnimatedLogo.tsx
│   │   ├── AppIcon.tsx
│   │   ├── Logo.tsx
│   │   ├── brand.css
│   │   ├── geometry.ts
│   │   ├── glyphs.json
│   │   ├── index.ts
│   │   ├── parts.tsx
│   │   └── tokens.ts
│   └── make-glyphs.py
├── svg/
│   ├── app-icon/
│   │   ├── midan-app-icon-indigo.svg
│   │   ├── midan-app-icon-maskable.svg
│   │   └── midan-app-icon-sand.svg
│   ├── favicon/
│   │   └── midan-favicon.svg
│   ├── logo-arabic/
│   │   ├── midan-logo-arabic-dark.svg
│   │   ├── midan-logo-arabic-light.svg
│   │   ├── midan-logo-arabic-mono-black.svg
│   │   └── midan-logo-arabic-mono-white.svg
│   ├── logo-bilingual/
│   │   ├── midan-logo-bilingual-dark.svg
│   │   ├── midan-logo-bilingual-light.svg
│   │   ├── midan-logo-bilingual-mono-black.svg
│   │   └── midan-logo-bilingual-mono-white.svg
│   ├── logo-english/
│   │   ├── midan-logo-english-dark.svg
│   │   ├── midan-logo-english-light.svg
│   │   ├── midan-logo-english-mono-black.svg
│   │   └── midan-logo-english-mono-white.svg
│   ├── logo-primary/
│   │   ├── midan-logo-primary-dark.svg
│   │   ├── midan-logo-primary-light.svg
│   │   ├── midan-logo-primary-mono-black.svg
│   │   └── midan-logo-primary-mono-white.svg
│   ├── mark/
│   │   ├── midan-mark-dark.svg
│   │   ├── midan-mark-light.svg
│   │   ├── midan-mark-mono-black.svg
│   │   └── midan-mark-mono-white.svg
│   ├── sticker/
│   │   ├── midan-sticker-badge-dark.svg
│   │   ├── midan-sticker-badge-light.svg
│   │   ├── midan-sticker-badge-mono.svg
│   │   ├── midan-sticker-diecut-dark.svg
│   │   ├── midan-sticker-diecut-light.svg
│   │   └── midan-sticker-diecut-mono.svg
│   └── wordmark/
│       ├── midan-wordmark-arabic-dark.svg
│       ├── midan-wordmark-arabic-light.svg
│       ├── midan-wordmark-arabic-mono-black.svg
│       ├── midan-wordmark-arabic-mono-white.svg
│       ├── midan-wordmark-english-dark.svg
│       ├── midan-wordmark-english-light.svg
│       ├── midan-wordmark-english-mono-black.svg
│       ├── midan-wordmark-english-mono-white.svg
│       ├── midan-wordmark-stacked-dark.svg
│       ├── midan-wordmark-stacked-light.svg
│       ├── midan-wordmark-stacked-mono-black.svg
│       └── midan-wordmark-stacked-mono-white.svg
├── tokens/
│   ├── midan-colors.css
│   └── midan-colors.json
├── web-public/
│   ├── apple-touch-icon.png
│   ├── favicon-16.png
│   ├── favicon-32.png
│   ├── favicon-48.png
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-maskable-512.png
│   └── site.webmanifest
└── BRAND_GUIDELINES.md
```
