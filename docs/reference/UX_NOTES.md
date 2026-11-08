# مِيدان · UI/UX concept notes (light theme only, v1)

## 1. UX rationale
**Hierarchy.** Every screen answers three questions in this order: *what needs me now* (priority/late), *what is happening* (status, progress), *what can I do* (one primary action). On the dashboard the priority card and the four status cards come first; projects, team activity and updates are secondary context. Copper marks only things that need attention (late, offline queue, the + on mobile), so it stays meaningful.

**Navigation.** Desktop: persistent right-hand sidebar (RTL) in three groups: *Operations* (dashboard, tasks, projects, teams), *Analysis* (reports), *Administration* (settings). Active state is a tinted pill plus darker text, not colour alone. The late-task count sits on "Tasks". Mobile: bottom bar with four destinations (Today, Tasks, Alerts, Account) and a raised **+** for create/update, reachable by thumb. The field worker's default screen is *Today*, not a dashboard.

**Field worker.** One task is expanded at a time with 52 px buttons for start / in progress / finish and add note / photo / location. Offline is stated plainly and the sync queue is a visible count ("4 changes waiting"), because trust in offline work comes from seeing that nothing is lost.

**Status is never colour-only.** Badges combine colour, a shape (circle, square, diamond) and a word.

**Offline-first honesty.** Saves say "saved on your device"; sync is a state (offline, syncing, done, error), never a blocking spinner. Errors reassure first ("your data is safe on the device").

**General core.** Task types, custom fields, statuses and the status workflow live in Settings; create-task shows custom fields per task type, and the status flow is drawn from configuration, so one organization's vocabulary is not hard-coded. Names in the mockups (projects, teams, areas) are illustrative placeholders.

**Modals and drawers.** Confirmation dialog only for irreversible actions (board 10b, delete is disabled until the user confirms); side drawer for quick task detail on desktop (3b); bottom sheet on mobile (3c); sync conflicts are resolved field by field, nothing is deleted before the user chooses (10c).

## 2. Design tokens (light theme only)
**Colour** — Indigo `#1B2A4E` (text, primary buttons, left route) · Teal `#1F7A6F` (progress, active) · Copper `#BF7129` (accent, attention) · Sand `#F4EDE0` (page) · Surface `#FFFDF8` · Line `rgba(27,42,78,.12)` · Muted text `#566079`.
**Status tints (bg / text)** — new `#E5E8F1 / #1B2A4E` · active `#E3F0EC / #17615A` · done `#E9E5DA / #566079` · late `#F8E6D2 / #86470F`.
**Spacing** 4 · 8 · 12 · 16 · 24 · 32. **Radius** card 14 · input/button 10 · badge/chip full. **Elevation** hairline border; shadow only on the mobile + button.
**Type** Readex Pro. Page title 22/600 · metric 28–30/600 · section 15/600 · body 14/400–500 · caption 12.5. Western digits. **Targets** ≥ 40 px desktop, 44–56 px mobile.
**Components** buttons: primary (indigo), secondary, important (copper, used sparingly) · inputs with visible labels and inline error messages (◆ icon + text + copper border) · tables with hover row · badges as above · banner for offline · toast for save.

## 3. Still to validate with real organizations and field teams
1. Which statuses and transitions do different organizations actually use, and who may change them?
2. Is "project → task" enough, or do some need programs, phases, or recurring tasks?
3. How do field workers capture evidence today (photos, forms, signatures, voice), and what is the minimum required?
4. How often are workers offline, for how long, and how do they want conflicts shown (two people edited the same task)?
5. Which devices, screen sizes and Android versions are common; is data cost a concern for photo upload?
6. What do supervisors check first each morning and what reports must leave the system (PDF, Excel, formats for donors/municipalities)?
7. How are areas and locations defined (neighbourhood lists, coordinates, maps)? Is a map required in v1?
8. What roles and permissions are needed beyond admin / supervisor / field worker?
9. Privacy: whose location is visible to whom, and what must never leave the device?
10. Language: any need for English or other languages inside the product, and Arabic digit preference?

## 4. Scope and limits of this concept
Light theme only; no dark theme exists in the artifact. Drawn: dashboard, tasks (desktop and mobile), task details plus desktop drawer and mobile bottom sheet, create task, field worker mobile, projects, teams, reports, settings, system/states board (empty, loading, offline, syncing, synced, error, permission-restricted), confirmation dialog and sync-conflict screen. Still conceptual: real interactions and transitions, map, evidence capture flow, conflict-resolution edge cases (deletes, many fields), permissions per role, export. Sample data is illustrative.
