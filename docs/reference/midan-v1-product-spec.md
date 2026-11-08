# مِيدان · midan: V1 Product Specification

**Status:** Prototype implementation brief v0.2, approved for frontend prototyping; field validation is still pending
**Sources:** the six project documents and the approved brand image. Nothing in them has been validated with real organizations yet.
**What "V1" means here:** the first clickable UI prototype (mock data, local React state). It is not the first production release.

**Legend**

| Tag | Meaning |
|---|---|
| **[C]** | Confirmed decision (already made in the project documents) |
| **[A]** | Assumption or proposal (reasonable, not validated; needs your approval or interview evidence) |
| **[V]** | Needs validation with real organizations and field teams |

---

## 1. Product definition

- **[C]** A reusable, Arabic-first (RTL), light-theme platform for managing field work. Each organization gets its own private workspace and owns its data.
- **[C]** Core chain: جهة → مشروع → فريق → مهمة → موقع → حالة → توثيق → مراجعة → تقرير.
- **[C]** Task cycle: create → set location → assign team/person → execute → add note/photo/evidence → review → close → report.
- **[C]** Not in scope as a product: a citizen-complaint platform, accounting or HR system, central beneficiary database, social network, national government system, or a single-sector app.
- **[A]** The V1 prototype shows one placeholder organization ("اسم المنظمة"). Multi-organization is a data-model concern only, not a feature.
- **[C — product decision]** Static bilingual wordmark: مِيدان (with kasra) / `Midan` (capital M followed by lowercase `i`, `d`, `a`, `n`). Concept: Rising Routes, "مساران، ووجهة واحدة". Existing legacy brand assets that contain lowercase `midan` remain unchanged. The typographic M in `Midan` is not the approved M symbol or app icon.

## 2. V1 target users

**Who the prototype must work for (what the tester does):**

| Audience | Why they matter |
|---|---|
| Supervisors / operations managers | Create, assign and review tasks; read reports |
| Field workers | Execute one task at a time on a phone, often with weak connectivity |
| Decision makers | Approve adoption; care about privacy, hosting and value |

- **[C — product direction]** Target organization types considered over time: NGOs and civil society groups, service/maintenance/contracting teams, municipalities and local administrative units, education/health/relief programs, organized volunteer teams.
- **[A — current go-to-market assumption]** Municipalities are considered a later target, not the starting point; the first organization type remains undecided.
- **[V]** Which single organization type and use case is the first entry point is **not decided**. The prototype stays neutral across types; it must not hard-code one organization's vocabulary.

## 3. Core problem

- **[V]** Working hypothesis: In some organizations, field work may currently be coordinated through a mix of WhatsApp, calls, spreadsheets, files, notebooks and supervisors' memory.
- **[V]** Possible consequences may include lost or delayed tasks and information, unclear ownership, no reliable view of late work, lost photos and notes, slow reports, duplicated data entry, dependence on specific people, weak documentation and difficulty working during connectivity outages. These consequences have not yet been validated with real organizations.
- **[A]** Hypothesis: some organizations may need something more structured than chat and loose files, if it is simple, Arabic-native, works with weak internet and respects data privacy.
- **[V]** These are hypotheses, not facts. A good-looking prototype is not evidence of need.

## 4. V1 scope

**In scope:** a responsive, clickable, Arabic RTL, light-theme UI prototype that lets a tester complete the core task cycle using realistic mock data held in local React state, including simulated offline and sync states.

**Out of scope:** everything that persists, authenticates, syncs or scales (see section 6).

| Boundary | V1 prototype |
|---|---|
| Data source | Generated mock data in memory |
| Persistence | None. Reloading the page resets the data (stated openly, see section 13) |
| Users | One placeholder organization; role switcher for demo only |
| Network | No requests; works with the network disabled |
| Purpose | Learn from testers; support interviews; settle terminology and flows |

## 5. Features included in V1

| ID | Feature |
|---|---|
| F1 | App shell: right-hand sidebar (desktop), bottom bar with raised + (mobile), RTL throughout |
| F2 | Dashboard: priority card, four status cards, active projects, team activity, latest updates, connectivity indicator |
| F3 | Task list: search, filters (status, project, team, area, priority, date), sorting, pagination, empty/no-result states |
| F4 | Task details (full page and desktop side drawer; mobile bottom sheet): description, type, project, location, team, assignee, priority, due date, status, notes, evidence placeholders, activity log |
| F5 | Create / edit task, with custom fields rendered from the selected task type's configuration |
| F6 | Assign to team or person |
| F7 | Status change following the task type's workflow, with an activity-log entry |
| F8 | Add note (text) |
| F9 | Add evidence as a placeholder (picks from a few bundled sample images; no camera, no file upload) |
| F10 | Add location as a simulated action (picks an area from a list; no geolocation API) |
| F11 | Field worker "Today" screen: one expanded task at a time with large action buttons |
| F12 | Projects list with progress and late counts; Teams list with members, load and current activity |
| F13 | Reports: completed, late, by project, by team, by area, by date (read-only; export shown as "قريبًا", disabled) |
| F14 | Settings: read-only view of organization profile, task types and custom fields, statuses and workflows, roles, privacy and sync options |
| F15 | System states: empty, loading, offline, syncing, synced, error, permission-restricted |
| F16 | Confirmation dialog for irreversible actions only (delete task) |
| F17 | Simulated connectivity (demo panel): online / offline / sync error, with a pending-changes counter |
| F18 | Demo role switcher: admin, supervisor, field worker, driving what each role sees |

**[A]** Settings is read-only in V1. The configurability is demonstrated through data (task types, fields, workflows drive the forms and status controls), not through an editor.

## 6. Features explicitly excluded from V1

Backend and API · remote database · **IndexedDB or any browser storage** · authentication and sessions · real multi-organization isolation · real synchronization and conflict resolution (the conflict screen is a design reference only) · real camera, file upload or geolocation · maps · PDF/Excel export · push notifications · payments and subscriptions · recurring tasks · programs/phases hierarchy · custom-field and workflow editors · AI features · integrations with external systems · English or other languages in the UI · dark theme or any theme toggle · beneficiary records or any sensitive personal data.

## 7. Main user roles

**[C — prototype decision]** Three roles are included in V1. **[V]** The worksheet also lists "operations manager" and "report reader"; both are deferred until interviews show they are needed.

| Role | Can do in the prototype | Cannot do |
|---|---|---|
| Admin (مسؤول النظام) | Everything a supervisor can; view Settings | n/a |
| Supervisor (مشرف) | Create, edit, assign, review and close tasks; see dashboard, projects, teams, reports | Delete tasks (admin only) [A] |
| Field worker (عامل ميداني) | See own/team tasks; change status; add notes, evidence, location | Create tasks [A], see reports, see other teams' tasks |

- **[C]** Principle of least privilege.
- **[A]** "Create tasks" for field workers is withheld here; mobile **+** for workers means "add note / photo / update". **[V]** Some organizations will want workers to create tasks.
- **[C]** The permission-restricted state is shown when a role opens a screen it cannot use (e.g. a worker opening Reports).

## 8. Core user flows

**Flow A. Create and assign (supervisor, desktop)**
1. Open "مهمة جديدة". 2. Enter title, choose type (custom fields appear), project, area, team, priority, due date. 3. Save. 4. Task appears in the list as "جديدة" with a toast.

**Flow B. Execute (field worker, mobile)**
1. Open "اليوم". 2. Open the day's task. 3. Tap "بدء", then add a note, a photo placeholder and a location. 4. Tap "إنهاء" (or "إرسال للمراجعة" if the task type's workflow has a review step).

**Flow C. Review and close (supervisor)**
1. Open a task awaiting review (or a done task) in the side drawer. 2. Read notes and evidence. 3. Approve (close) or return for rework. 4. Activity log records the decision.

**Flow D. Offline (any role)**
1. Toggle "غير متصل" in the demo panel. 2. Make changes; the banner and the "N changes waiting" counter update. 3. Toggle back online; syncing state, then "اكتملت المزامنة". 4. Optional: trigger the sync-error state; reassure first, offer retry.

**Flow E. Morning check (supervisor)**
1. Open the dashboard. 2. Read the priority card (late/high-priority). 3. Open a late task. 4. Reassign or add a note.

**Flow F. Irreversible action**
Delete task → confirmation dialog requires an explicit acknowledgment before the delete button enables.

## 9. Required screens and navigation

**Desktop sidebar (right side, RTL), grouped:**
- العمليات: لوحة التحكم · المهام (with late count) · المشاريع · الفرق
- التحليل: التقارير
- الإدارة: الإعدادات

**Mobile bottom bar:** اليوم · المهام · التنبيهات · الحساب, with a raised **+** (add note/photo/update or create, by role). **[C]** The field worker's default screen is "اليوم".

| # | Screen | Desktop | Mobile | Notes |
|---|---|---|---|---|
| 1 | Dashboard | ✔ | n/a for workers | Supervisors on mobile get a compact version [A] |
| 2 | Task list | ✔ | ✔ | Table on desktop, cards on mobile |
| 3 | Task details | ✔ page + side drawer | ✔ bottom sheet | |
| 4 | Create / edit task | ✔ | ✔ | |
| 5 | Today (field worker) | n/a | ✔ | Default for workers |
| 6 | Projects | ✔ | ✔ simple list | |
| 7 | Teams | ✔ | ✔ simple list | |
| 8 | Reports | ✔ | ✔ simplified | |
| 9 | Settings | ✔ | ✔ simplified | Read-only |
| 10 | Alerts | n/a | ✔ minimal | Late tasks and sync notices only [A] |
| 11 | Account | n/a | ✔ minimal | Role switcher and demo panel live here in the prototype |
| 12 | States gallery | ✔ | ✔ | Dev/demo route showing every system state |

**Overlays:** confirmation dialog · task drawer (desktop) · task bottom sheet (mobile) · toast · offline banner · sync-conflict screen (static design reference only, reachable from the states gallery).

**[A]** No "Locations/Map" tab in V1. Location is a field on the task (area picked from a list). **[V]** Whether a map or location list is needed.

## 10. Initial task workflow and statuses

**[C]** Statuses are not final and must be validated; **[C]** statuses must be configurable per organization (and, by design, per task type).

**Model [A]:** a workflow is data: an ordered set of statuses plus allowed transitions and who may trigger each. No status name is hard-coded in components.

**Default workflow (mock "standard"):**

| Key | Label | Notes |
|---|---|---|
| `new` | جديدة | Created, may be unassigned |
| `in_progress` | قيد التنفيذ | Work has started |
| `done` | مكتملة | Closed |

**Second mock workflow ("with review"):** `new` → `in_progress` → `in_review` (قيد المراجعة) → `done`, with return-to-`in_progress` allowed. Used by the "صيانة" task type (matches the concept's "مع موافقة المشرف").

**Late (متأخرة): proposed change [A].** The concept draws "late" as a status. In the prototype it is a **derived flag**: due date has passed and the task is not done. Reasons: a task can be both in progress and late, and the concept's mock data already shows inconsistencies (a task marked late that is due tomorrow). The badge still shows color + shape + word.

**Transition rules (mock):**
- Supervisor/admin: any allowed transition, including reopening a done task.
- Field worker: forward transitions only, on tasks assigned to their team or themselves.
- Every transition writes an activity-log entry (who, what, when, from/to).

**Status badge:** color tint + shape + word, never color alone (see section 15).

## 11. Initial data models

Field-level proposal, not final schema. All entities carry `orgId` so the structure can scale to multiple organizations later.

| Entity | Fields |
|---|---|
| Organization | id, name, logo (placeholder), createdAt |
| User | id, orgId, name (fictional), role, teamIds, presence (active/offline/break), isActive |
| Team | id, orgId, name, supervisorId, memberIds, areaId |
| Project | id, orgId, name, description, startDate, endDate, areaIds, ownerId, state (planned/active/done) |
| Area | id, orgId, name (generic placeholder), optional parentId |
| TaskType | id, orgId, name, workflowId, customFieldDefs[], requiresEvidence (none / optional / minimum N) |
| CustomFieldDef | key, label, kind (text, number, choice, date), required |
| Workflow | id, orgId, name, statuses[], transitions[] (from, to, allowedRoles) |
| Task | id, displayNumber, orgId, title, description, typeId, projectId, areaId, teamId, assigneeId?, status, priority (low/medium/high), dueDate?, customValues{}, createdBy, createdAt, updatedAt, syncState (simulated: synced / pending / error) |
| Note | id, taskId, authorId, text, createdAt, syncState |
| Evidence | id, taskId, kind (photo placeholder), sampleAsset, addedBy, createdAt, syncState |
| ActivityEvent | id, taskId, actorId, type, from?, to?, createdAt |

**Derived, never stored:** `isLate`, project progress, team load, all dashboard and report counts.

## 12. Mock data requirements

- One organization with a neutral placeholder name. Fictional first names only. No phone numbers, national IDs, real addresses, real neighborhoods or real people.
- Volume (enough to exercise filters, pagination and charts): ~5 projects, ~5 teams, ~12 users, ~40 tasks, ~3 task types, 2 workflows, ~8 generic areas.
- Task distribution: all statuses represented; ~15% late; a mix of priorities; at least 2 unassigned tasks.
- **Dates generated relative to "today"** at load, so late/overdue states are always real.
- **All counts computed from the data** (dashboard, projects, reports, sidebar late count). No hard-coded totals. This fixes the concept's inconsistencies (e.g. 0 late in a project that has a late task in Reports).
- Edge cases included: very long Arabic title, task with no assignee, empty project, team with zero tasks, task with 3 notes and 2 evidence items, a task with a pending sync item.
- Evidence uses 3 to 4 bundled neutral sample images (no people, no identifiable places).
- **[C — prototype decision]** Numerals are Western digits. Month names are avoided where possible (relative dates such as اليوم / غدًا / قبل يومين; otherwise dd/mm). **[V]** Preferred month names and calendar format.
- Reports and dashboard show clearly illustrative figures; no claims such as "+12%" unless computed from the mock set.

## 13. Offline-first behavior for the prototype

Be honest: the V1 prototype **does not persist or sync anything**. It simulates the experience so testers can react to it.

- All data lives in local React state (single store). Reload resets to the seed data. **[A]** A small "نسخة تجريبية" marker in the demo panel says so.
- Demo panel (Account on mobile, footer on desktop) offers: online / offline / sync-error, and "reset demo data".
- **While "offline":** persistent banner; each create/edit/note/evidence marks the item `syncState = pending`; counter "N تغييرات بانتظار المزامنة"; items show a small pending indicator.
- **Back online:** "جارٍ التزامن" state (non-blocking, user can keep working), then "اكتملت المزامنة"; pending items become synced.
- **Sync error:** reassuring message first, then retry. Never a blocking spinner.
- **[A] Copy rule:** the text "تم الحفظ على جهازك" / "بياناتك آمنة على الجهاز" is accurate only once real local storage exists. In the prototype use neutral wording such as "تم الحفظ" with the demo marker. Switch to device-storage wording when IndexedDB is implemented and tested.
- **[C]** Do not claim "works fully offline" before real testing on real devices and connections.
- **[A]** The sync-conflict screen (field-by-field choice, nothing deleted before the user picks) is a static design reference. It also assumes multiple users and a server, which V1 does not have.

## 14. Privacy assumptions

- **[C]** Organization data belongs to the organization. Each organization is a private workspace. No organization sees another's data.
- **[C]** V1 contains no sensitive real-world data: no personal documents, health data, children's or vulnerable households' data, or sensitive locations.
- **[A]** The prototype makes no network requests, loads no analytics or third-party scripts, and calls no browser APIs for storage, camera or geolocation. Fonts and assets are bundled locally.
- **[A]** Worker location is shown only as a simulated area, never real coordinates.
- **[C]** Do not promise "absolute privacy" to organizations before the hosting model and access rules are defined.
- **[V]** Hosting model (cloud with isolation, private server, local, local-first), who sees worker location, what must never leave the device, retention and deletion policy.
- **[A]** Delete-confirmation copy in V1 must not mention a server ("ومن الخادم"), since none exists.

## 15. UI/UX requirements

**Brand [C]**
- Use the current static bilingual wordmark `مِيدان / Midan` in the application header, desktop navigation, mobile header and relevant interface surfaces. Preserve the kasra. The typographic M in `Midan` is a capital letter, not the approved M symbol.
- Keep the original approved M symbol and app icon unmodified and separate from the wordmark. Use the original symbol for the app icon, favicon and compact spaces where the full wordmark cannot fit. Do not use it as a loading indicator, and do not add animation or an M-to-Midan transition.
- Use approved light-variant brand assets unmodified, on Sand or white only. Never mirror, recolor, stretch, outline, add effects, retype or crop. Desktop and mobile wordmark sizing must be tested against the F1–F6 static visual reference.
- Wordmark palette: deep blue `#0E3A5F` with optional accent `#1F5FA8`, as selected in the F1–F6 static reference.
- Product UI palette: Indigo `#1B2A4E` (text and primary buttons) · Teal `#1F7A6F` (progress and active states) · Copper `#BF7129` (attention) · Sand `#F4EDE0` (page) · Surface `#FFFDF8` · Line `rgba(27,42,78,.12)` · Muted `#566079`. Night `#0F1730` remains in the brand kit and is reserved for approved dark/reversed brand applications, not a dark UI theme.
- Keep the wordmark color role separate from the product UI color role; do not mix them arbitrarily.
- Status tints (bg / text): new `#E5E8F1 / #1B2A4E` · active `#E3F0EC / #17615A` · done `#E9E5DA / #566079` · late `#F8E6D2 / #86470F`.
- Copper only for: late, offline queue, the mobile + button, error borders, and sparing important actions. Never large areas or body text.
- **[A]** Contrast rule: Copper is 3.2:1 on Sand and white-on-copper is about 3.7:1, which fails WCAG AA for normal text. Copper is a graphic/border/icon color; any text on it must be large and bold, or use the dark-copper-on-tint pattern (`#86470F` on `#F8E6D2`). Decide this in the design cleanup before building the "important" button.

**Layout and language**
- Arabic-first RTL using CSS logical properties; no hand-flipped layouts. Western digits are the current prototype decision; preferred numeral and date conventions remain open for validation.
- Light theme only: no dark tokens, no `prefers-color-scheme` branching, no toggle. **[A]** Use Sand (not Night) for `theme-color` and any splash, to respect light-only.
- Mobile-first for the field worker; desktop for supervisors.

**Typography [C]**
- Readex Pro. Page title 22/600 · metric 28–30/600 · section 15/600 · body 14/400–500 · caption 12.5.
- **[A]** The brand pack bundles only weight 600; weights 400/500 must be added (e.g. `@fontsource/readex-pro`, bundled locally) and the fallback stack kept: `"Readex Pro", system-ui, "Segoe UI", Tahoma, sans-serif`.

**Shape and spacing [C]**
- Spacing 4 · 8 · 12 · 16 · 24 · 32. Radius: card 14, input/button 10, badge full. Hairline borders; shadow only on the mobile + button.

**Interaction and accessibility**
- Targets: ≥ 40 px desktop; 44–56 px mobile; field-worker action buttons ~52 px.
- Status is never color alone: color + shape + word. **[A]** The concept names three shapes (circle, square, diamond) for four states; the final mapping (including a 4th shape for "in review"/"late") must be fixed in the cleanup pass.
- Visible focus rings, keyboard-operable desktop UI, real labels on inputs, inline errors (icon + text + border), `aria-live` for toast and sync status, `prefers-reduced-motion` respected.
- No blocking spinners for sync. Errors reassure first.
- Confirmation dialogs only for irreversible actions.
- Every list has designed empty, loading and no-results states.

**Copy rules**
- Calm, plain Arabic. One term per concept across the app (e.g. "نشطة" vs "قيد التنفيذ" must be unified). **[V]** Final terms (مهمة / بلاغ / زيارة / طلب) come from interviews.

## 16. Acceptance criteria for each main screen

**Dashboard**
- Shows priority card first, then four status cards, then projects, team activity, updates.
- All numbers match the underlying mock data; sidebar late count equals the dashboard late count.
- Priority card items open the task drawer.
- Connectivity indicator reflects the simulated state.

**Task list**
- Search and each filter work alone and combined; "clear filters" resets.
- Sorting by due date and priority works; pagination shows correct "x–y of N".
- Rows show title, number, project, team, area, priority, due, status badge, pending-sync marker.
- No-result and empty states are shown correctly.
- Row click opens the drawer (desktop) or bottom sheet (mobile).

**Task details**
- Shows every field in section 5 (F4), with status changes limited to allowed transitions for the current role.
- Adding a note or evidence appears immediately and writes an activity entry.
- Late flag appears only when due date has passed and task is not done.
- "Delete" is visible for admin only and opens the confirmation dialog.

**Create / edit task**
- Required fields validated inline with a message; title shorter than 3 chars rejected.
- Changing task type changes the custom fields shown and the workflow used.
- Saving adds the task to the list, shows a toast, and (when "offline") marks it pending.
- Leaving with unsaved input does not silently lose it (draft kept in state while the app is open).

**Field worker "Today"**
- Opens by default for the worker role; shows only that worker's/team's tasks for today.
- One task expanded at a time; action buttons ≥ 52 px; start / in progress / finish and note / photo / location work.
- Offline banner and "N changes waiting" counter are visible when offline.
- Usable at 360 px width with one hand; no horizontal scroll.

**Projects**
- Cards/rows show supervisor, progress, task count, done count, late count, all derived.
- Filter by state works; empty project renders without errors.

**Teams**
- Shows supervisor, members, assigned tasks, current activity and load level.
- Member presence (active / offline / break) is shown with text plus an indicator, not color alone.
- Team with zero tasks renders correctly.

**Reports**
- Period, project and team filters change all figures consistently.
- Covers completed, late, progress by project, activity by team; area and date views per F13.
- Export controls are visibly disabled with "قريبًا".
- Restricted roles see the permission-restricted state.

**Settings**
- Read-only sections: organization profile, users and roles, teams, task types and fields, statuses and workflows, privacy and sync.
- Changing task types/workflows in mock config visibly changes the create-task form and status controls (verified by a dev check).

**Mobile task bottom sheet**
- Opens from the list; shows title, status, project, team, area, due, last note; actions: status, note, photo, location, "view all details".
- Dismissible by swipe or close button; focus is managed.

**System states**
- Gallery shows empty, loading, offline, syncing, synced, error, permission-restricted, confirmation dialog, and the static conflict reference.
- Each state uses color + icon/shape + text, with reassuring copy for error and offline.

## 17. Open questions to validate through field interviews

1. Which statuses and transitions do different organizations actually use, and who can change them? **[V]**
2. Is project → task enough, or are programs, phases, visits or recurring tasks needed?
3. How is evidence captured today (photos, forms, signatures, voice) and what is the minimum required to close a task?
4. How often and how long are workers offline? How should two people editing the same task be handled?
5. Which devices, screen sizes and Android versions are common? Is photo upload data cost a concern?
6. What do supervisors check first each morning? What reports must leave the system, in which format (PDF, Excel, donor/municipality formats)?
7. How are areas and locations defined (neighborhood lists, coordinates, maps)? Is a map needed early?
8. Which roles exist beyond admin / supervisor / field worker?
9. Who may see a worker's location, and what must never leave the device?
10. Is another language needed? Arabic or Western digits? Preferred month names and date format?
11. Who decides to adopt a new tool, who pays (organization, project budget, donor), and what training time is acceptable?
12. What makes teams reject a new tool? What tools are in place today and what do they fail to cover?

## 18. Decisions that must wait until after interviews

- Final status list, transitions and whether a review step is default.
- The first use case and organization type to build for.
- The unit of work: task, visit, request, or something else; and the vocabulary used in the UI.
- Whether tasks can be recurring, or grouped into programs/phases.
- Minimum evidence rules and evidence types (photo, form, signature, voice).
- Conflict-resolution behavior and the real offline scope.
- Roles beyond the three in V1, and each role's data visibility.
- Map vs list for locations; worker-location visibility.
- Report formats and templates.
- Hosting model, data retention, and the privacy promises made to organizations.
- Business model, pricing and who pays.
- Team ownership, IP and contribution agreements (needed before any shared development or commercial work).
- Trademark clearance for the name and logo before public launch (none has been run).

## 19. Recommended implementation order

**Step 0. Design cleanup and freeze** (in Claude, not in code): fix the items flagged in this spec (late as derived flag, copper contrast rule, shape mapping, honest copy, consistent mock data), then freeze the concept.
**In parallel:** start field interviews; do not wait for the prototype.

Then, once this spec is approved and a repository exists, in Claude Code, **plan first, implement after approval**:

1. Scaffold: Vite + React + TypeScript + Tailwind (RTL, logical properties); copy brand assets and tokens; add local Readex Pro weights.
2. Types and mock data generator (relative dates, computed counts).
3. Single local store (context + reducer) with actions, selectors and the workflow engine.
4. App shell: sidebar, bottom bar, header with logo, demo panel, role switcher.
5. Tasks: list, filters, details drawer/sheet, create/edit, notes, evidence placeholders.
6. Field worker "Today" flow (the most important mobile path).
7. Dashboard, projects, teams, reports, settings (read-only).
8. System states: offline simulation, sync, errors, permissions, confirmation dialog, states gallery.
9. QA: TypeScript, production build, real-browser checks at 360 and 1440 px, RTL, accessibility pass.
10. Short usability script and 3 to 5 test sessions with real people.

After the UI is accepted and the interviews confirm the flow: IndexedDB (separate phase, separate approval). Backend, authentication, multi-organization and real sync only after a limited field trial proves value.

## 20. Definition of done for the first UI prototype

- Flows A to F in section 8 complete end-to-end with mock data and local state.
- Every screen in section 9 exists, meets its criteria in section 16, and renders correctly in RTL.
- Light theme only; no dark tokens or toggle anywhere in code.
- Approved logo files are used unmodified; palette, fonts and tokens match section 15; Copper is used only as specified.
- No network requests, no storage APIs, no camera/geolocation calls, no analytics.
- All counts and statuses derive from data; no hard-coded figures; no unsupported claims in copy.
- Simulated offline, syncing, synced, error and permission states all reachable and tested.
- TypeScript passes without errors; production build succeeds; no browser console errors.
- Checked in a real browser at 360 px and 1440 px, including keyboard navigation and visible focus.
- Status is never conveyed by color alone anywhere.
- A README states plainly what the prototype is and is not (mock data, resets on reload, no sync).
- At least a few non-technical people have tried the core flow without guidance, and their observations are written down.
- The terms, statuses and flows are listed as "to be confirmed" wherever sections 17 and 18 apply.

---

## Appendix: Proposed deviations from the earlier concept (for your approval)

| # | Change | Why |
|---|---|---|
| 1 | "Late" becomes a derived flag, not a status | A task can be in progress and late; mock data was inconsistent |
| 2 | Optional "قيد المراجعة" status via a second mock workflow | The core chain includes review; default flow had no review state |
| 3 | No "saved on your device" copy in V1 | No real local storage exists in the prototype |
| 4 | Settings is read-only | Editors for workflows and fields are out of scope; configurability is shown through data |
| 5 | Sync-conflict screen is a static reference | Requires a server and multiple users |
| 6 | Copper contrast rule for text | White on copper fails AA for normal text |
| 7 | Add Readex Pro 400/500 | Brand pack bundles only 600 |
