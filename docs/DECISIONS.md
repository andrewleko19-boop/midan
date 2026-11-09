# Decisions

Tags: **[C]** confirmed by the owner · **[A]** assumption or proposal, not validated · **[V]** needs validation with real organizations.

## Stack and tooling
- **[C]** React 19 (owner correction; not 18), TypeScript strict, Vite, Tailwind CSS 3.4, ESLint with `jsx-a11y`, Vitest, Playwright (dev only).
- **[A]** Pinned to what resolves cleanly today: `typescript ~5.9` (typescript-eslint does not yet accept TS 7) and `eslint 9` (`eslint-plugin-jsx-a11y` does not yet accept ESLint 10). Revisit when those plugins catch up.
- **[A]** Not installed yet, on purpose: router (Step 5), `@radix-ui/react-dialog` and `lucide-react` (Step 3). They are added when first used.
- **[A]** One `tsconfig.json` instead of project references; revisit if build time or config clarity suffers.
- **[A]** Vite's modulepreload polyfill is disabled (`build.modulePreload.polyfill: false`) because it calls `fetch()`.
- **[A]** No animation or transition anywhere in V1, including overlays. Tailwind's motion utilities are disabled in `tailwind.config.ts`; `base.css` keeps a `prefers-reduced-motion` safety net only.

## Fonts
- **[A]** Readex Pro 400/500/600 from `@fontsource/readex-pro` (Arabic + Latin subsets, self-hosted). The brand package only bundles weight 600; this deviates from the `ASSET_USAGE` copy recipe on purpose.

## Tokens (`src/styles/tokens.css`)
Three separate layers: brand, ui, wordmark. Wordmark colors (`#0E3A5F`, optional `#1F5FA8`) are never mixed into the product UI palette. Night stays in the brand layer and is not used by the UI.

**Contrast, measured by `tests/contrast.test.ts`:**

| Pair | Ratio | Rule |
|---|---|---|
| Indigo text on Sand / Surface | 12.12 / 13.88 | text ≥ 4.5 ✔ |
| Muted `#566079` on Sand / Surface | 5.39 / 6.18 | text ≥ 4.5 ✔ |
| Status text on status tint: new / active / review / done | 11.52 / 6.20 / 6.64 / 4.99 | text ≥ 4.5 ✔ |
| Late: `#86470F` on `#F8E6D2` | 5.90 | text ≥ 4.5 ✔ |
| Wordmark ink `#0E3A5F` on Sand / Surface | 10.08 / 11.55 | text ≥ 4.5 ✔ |
| Wordmark accent `#1F5FA8` on Sand / Surface | 5.53 / 6.34 | graphic ≥ 3 ✔ |
| Copper on Sand / Surface (graphic) | 3.22 / 3.68 | graphic ≥ 3 ✔ |
| Teal on Sand / Surface (graphic) | 4.43 / 5.07 | graphic ≥ 3 ✔ |
| White on Copper | **3.74** | text ≥ 4.5 ✘ |
| Indigo on Copper | **3.77** | text ≥ 4.5 ✘ |
| Night on Copper | 4.73 | text ≥ 4.5 ✔ |

- **[A]** Copper never carries normal-size text. The "important action" uses the late pattern (`#F8E6D2` background, `#86470F` text, Copper border), not a Copper-filled button. The mobile + button stays Copper with a white icon (a graphic, ≥ 3:1). Alternative if a filled Copper button is wanted later: Night text on Copper (4.73).
- **[A]** The "in review" status pair (`#D9EEE9` / `#145A52`) is provisional (no pair is defined in the spec). It is close to "active"; status is also carried by shape and word, never by color alone.
- **[A]** Status shapes (closes the open item in the spec): new = circle, in progress = square, in review = diamond, done = check mark, late flag = triangle. Applied in the badge component (Step 3).
- **[A]** Focus ring: 2px Indigo with 2px offset.

## Concept (PDF/Artifact) vs spec: the spec wins
The PDF is a layout reference only. Where it conflicts with `docs/reference/midan-v1-product-spec.md`:
- "Late" is a derived flag (due date passed and not done), not a status.
- No hard-coded or unsupported figures (for example "+12%"); every count is computed from the mock data and must agree across screens.
- One term per concept: **قيد التنفيذ** (not "نشطة") for tasks; "نشط" stays for project state only.
- Settings is read-only: no "save changes" button.
- No "saved on your device" copy and no mention of a server in V1 (there is no local storage or server). Neutral wording such as "تم الحفظ" plus the demo marker.
- The sync-conflict screen is a static design reference only.
- The concept's "important" Copper button is replaced by the pattern above.

## Brand
- **[C]** Static bilingual wordmark مِيدان / Midan (capital M) in headers and navigation. The original M symbol and app icon are used only for the app icon, favicon, and compact spaces. See `WORDMARK_NOTES.md`.
- **[A]** `public/site.webmanifest` is the only brand-package file that is edited: `name`, `short_name`, `start_url`, `theme_color` and `background_color` (Sand), plus `lang` and `dir` if absent. `theme-color` in `index.html` is Sand, not Indigo, to respect light-only. There is no service worker, so the manifest only supplies icons.

## Mock data (Step 4)
- **[C]** Area names and account names are supplied by the owner and used verbatim. Spec §12 asks for generic placeholders and no real neighborhoods; the owner has chosen their own names for this prototype, so that line is overridden for these names only.
- **[A]** Dates are generated relative to "today" at load; tests pass a fixed `now`.

## Step 1 status (honest)
- **Not verified:** the brand-package hash check. The brand package was not available when this step was built, so `public/` has no favicon or manifest yet and `brand-assets.sha256` does not exist. The copy/verify logic is tested only against synthetic fixtures (`tests/brand-copy.test.ts`). Run `npm run brand:copy` and `npm run brand:verify` once `brand-package/` is in place.

## Deployment (GitHub Pages)
- **[C]** Published from the Vite production build (`dist`) by GitHub Actions, not from a branch. Pages source must be "GitHub Actions".
- **[A]** `base` comes from `BASE_PATH` (set to `/<repo>/` in CI, `/` locally). `index.html` links use `%BASE_URL%`, and the manifest `start_url` is `./`, so nothing depends on the site living at the domain root.
- **[A]** The workflow builds only; it does not run `brand:verify` yet, because the brand package is not in the repo. Add it to the workflow once `brand-assets.sha256` is committed.
