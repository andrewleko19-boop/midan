# Midan (مِيدان) — standing project rules

Read these before every task. They come from the project brief and `docs/reference/midan-v1-product-spec.md`.

## What this is
A reusable field-operations management platform (organizations, service teams, municipalities, field programs): projects, teams, tasks, areas, statuses, notes, evidence, reports, offline work. Each organization is a separate private workspace.

**Current stage: V1 frontend prototype with mock data and local React state.** The core problem is still a hypothesis; field validation is pending. Do not call anything "ready" or "works offline".

## Hard rules
- Arabic-first, correct RTL (CSS logical properties; no hand-flipped layouts). Light theme only: no dark theme, no toggle, no `dark:`, no `prefers-color-scheme`.
- No backend, auth, remote database, real sync, or storage APIs (`localStorage`, `sessionStorage`, `indexedDB`, service worker). No network requests, analytics, camera, or geolocation. No animation or motion anywhere in V1.
- Mock data only, fictional and non-sensitive. No phone numbers, IDs, addresses, or coordinates. Mock data lives in `src/mock/` and config in `src/domain/config.ts`, so it is easy to replace.
- **Area names and account names are supplied by the owner and must be used exactly as given. Never invent extra neighborhood or account names.** Everything else in the mock data may be generated.
- Do not expand scope. Do not start a step that was not requested. Before major changes: explain the plan and list the files affected. Wait for approval between steps.
- Never claim a check passed unless you ran it. Report what was verified and what was not.

## Brand
- Static bilingual wordmark: **مِيدان** (keep the kasra) / **Midan** (capital M, lowercase i, d, a, n). Colors `#0E3A5F`, optional accent `#1F5FA8`. Use it in headers and navigation. Never redraw, mirror, stretch, recolor, outline, shadow, or retype it.
- The original approved M symbol and app icon stay unchanged and separate. Use the symbol only for the app icon, favicon, and compact spaces where the wordmark cannot fit. It is never a replacement for the wordmark and never a loading indicator.
- Original brand assets are copied byte for byte by `scripts/copy-brand-assets.mjs` and hash-verified (`npm run brand:verify`). Never edit them.
- Product UI palette (separate from the wordmark colors): Indigo `#1B2A4E`, Teal `#1F7A6F`, Copper `#BF7129`, Sand `#F4EDE0`, Surface `#FFFDF8`. Night `#0F1730` is reserved for approved reversed brand uses, not a UI theme.
- Copper is a graphic, border, or icon color only (late flag, offline queue, the mobile + button, error borders). Never body text, never large areas. Text on Copper fails WCAG AA.
- Font: Readex Pro 400/500/600, self-hosted via `@fontsource/readex-pro`. Fallback stack in `tailwind.config.ts`.
- Status is never color alone: color + shape + word. "Late" is a derived flag, not a status.

## Commands
`npm run check` = typecheck + lint + test + audit + brand:verify + build + audit:dist. `npm run e2e` runs Playwright (set `CHROMIUM_PATH` to use an installed Chromium).
