# Frontend ↔ Backend Contract Map

Produced by reading `backend/src` directly. This is the Phase 0 deliverable named in
`05_IMPLEMENTATION_PLAN.md`, and it corrects several assumptions in docs 00–08.

Read this before wiring any page.

---

## 1. Corrections to the existing briefs

| # | The briefs assume | The backend actually does | Impact |
|---|---|---|---|
| 1 | Endpoints like `/projects` | Every route is behind a global `/api` prefix (`main.ts`) | Base URL must be `http://host:3000/api` |
| 2 | A refresh-token flow (`POST /auth/refresh` → retry, else logout) | `/auth/refresh` is **guarded** — it needs a currently valid JWT and re-issues one with fresh permissions | There is no refresh grant. A 401 means sign in again. Use refresh only after a role/permission change |
| 3 | `user.type` | The field is `userType`, values `client` / `staff` / `admin` | Role resolution reads `userType` |
| 4 | `/users/me` returns permissions | It returns `user.toSafeJSON()` — **no permission slugs**. Permissions live in the JWT payload only | Either decode the JWT client-side (what `src/auth/token.js` does) or add permissions to `/users/me` |
| 5 | Pagination is `{ items, meta }` | Three different shapes exist — see §2 | Normalised in `src/api/http.js` |
| 6 | Query lifecycle is New → Assigned → In Progress → Waiting for Client → Resolved | The model only has `open`, `in-progress`, `resolved`, `closed` | Build the UI from four states, or extend the backend first |
| 7 | Files download via a link | `GET /files/:id/download` is behind the JWT guard | A plain `<a href>` or `window.open` sends no Authorization header. Must fetch as a blob |
| 8 | Payments are a module | There is no top-level `/payments`. Transactions only exist under `/invoices/:id/payments` | `AdminPayments.jsx` has no single endpoint today — see §5 |
| 9 | A `portal` concept isn't mentioned | `POST /auth/login` accepts an optional `portal` and rejects mismatched accounts server-side | The login role picker should send it |

---

## 2. The three list shapes

| Shape | Returned by |
|---|---|
| `{ data, meta: { total, page, limit, totalPages } }` | tasks, files, approvals, events, activity, invoices, queries |
| `{ data, total, page, limit }` (no `meta`, no `totalPages`) | projects, clients, staff, users |
| bare array | services, and most nested collections (deliverables, contacts, comments, folders by parent) |

`http.list()` normalises all three to:

```js
{ items: [...], meta: { total, page, limit, totalPages } }
```

So pages, tables and pagination controls only ever see one contract. If the backend is
later standardised, only `normalizeList()` changes.

---

## 3. Errors

Nest's default shape is `{ statusCode, message, error }`, where `message` is a **string**
for thrown exceptions and a **string array** from the global `ValidationPipe`
(`whitelist: true, forbidNonWhitelisted: true` — so sending an unknown field is a 400,
not a silent drop).

`ApiError` normalises this to `{ status, message, fieldErrors[], code, body }` with
`isForbidden` / `isNotFound` / `isValidation` / `isNetwork` helpers, so pages can render
the localised error states that `03_UI_UX_IMPROVEMENT.md` asks for.

---

## 4. Security model, as built

- `JwtAuthGuard`, `RolesGuard` and `PermissionsGuard` are registered globally in `AppModule`.
- Permission slugs (e.g. `team.view`, `team.edit`) are signed into the JWT so the guard
  needs no DB hit — which means **permissions go stale until the user re-logs in or you
  call `/auth/refresh`**.
- Frontend `RequireRole` and `can()` are UX only. They hide controls; they do not protect data.

---

## 5. Gaps worth deciding on before the relevant page is wired

1. **Admin "all payments" page** — needs either a `GET /payments` endpoint or an
   invoice-driven view. Don't fake it by fanning out per-invoice requests across a list.
2. **Notification destinations** — the model does carry a `link_url`, so click-through works
   today, but there is no structured `entityType`/`entityId`. Adding that (as
   `06_BACKEND_ALIGNMENT.md` recommends) is cheap now and expensive once several surfaces
   depend on the raw URL string.
3. **Permissions on `/users/me`** — adding them removes the need to decode the JWT in the browser.
4. **Client-scoped list filtering** — confirm whether `GET /projects` self-scopes for a
   `client` user or whether the frontend must always pass `clientId`. This changes the
   client dashboard wiring.
5. **Staff identity for attendance** — attendance routes are keyed by `staffId`, but
   `/users/me` returns a user. Confirm how a logged-in staff member resolves their own
   `staffId` (staff routes are keyed by `userId`, attendance may not be).
6. **Query statuses** — see §1.6.

---

## 6. What was built in this pass

```text
src/api/
  http.js            core client: base URL, bearer token, error + list normalisation,
                     401 teardown, multipart upload, authenticated blob download
  enums.js           status vocabularies mirrored from the backend enums
  index.js           single import surface
  auth.api.js  users.api.js  projects.api.js  tasks.api.js  approvals.api.js
  files.api.js clients.api.js invoices.api.js payments.api.js queries.api.js
  notifications.api.js activity.api.js staff.api.js attendance.api.js
  services.api.js events.api.js

src/auth/
  token.js           JWT decode for role/permission claims (UX only)
  AuthProvider.jsx   login → token → /users/me → userType → workspace
  guards.jsx         RequireAuth, RequireRole, homeRouteFor()
  index.js

src/hooks/
  useApiResource.js  useApiResource + useApiMutation
                     (loading / error / empty / forbidden / not-found,
                      idle / submitting / success / error)

.env.example         VITE_API_BASE_URL
```

Nothing existing was modified. No page was touched, no mock data deleted.

---

## 7. Wiring order from here

1. `main.jsx` — wrap the router in `<AuthProvider>`.
2. `Login.jsx` — replace the `navigate("/dashboard")` stub with
   `login({ email, password, portal })`, then redirect via `homeRouteFor(user.userType)`.
   The existing role picker only offers Client and Staff; admin needs a path in.
3. `App.jsx` — wrap route groups in `RequireRole`, add the missing `/notifications` and
   `/documents` routes the sidebar already links to, and add `/no-access`.
4. Projects vertical slice (Phase 3) — `listProjects` → `getProject` → deliverables →
   tasks → approvals. Projects touch everything else, so the adapter decisions made here
   set the pattern.

A useful first target is one page end to end — `StaffProjects.jsx` is a good candidate:
it's list-shaped, uses `listProjects({ staffId })`, and exercises loading, empty, error
and pagination in one go.

---

## 8. Usage

```js
import { projectsApi, ApiError } from "@/api";
import { useApiResource } from "@/hooks/useApiResource";

const { data, isLoading, error, isEmpty, refetch } = useApiResource(
  () => projectsApi.listProjects({ status, page }),
  [status, page],
);

// data.items, data.meta.totalPages
```


---

## 9. Second pass — auth, routing and the dead navigation links

Changes to existing files (everything else is still untouched):

| File | Change |
|---|---|
| `main.jsx` | Wrapped in `<AuthProvider>` |
| `Login.jsx` | Real `login({ email, password, portal })`, submitting + error states, redirect via `homeRouteFor()`, redirect away if already signed in, **Admin added to the role picker** — there was previously no way for an admin to sign in |
| `App.jsx` | Route groups wrapped in `RequireRole`; `/` and `*` now resolve per role instead of hard-redirecting everyone to the client dashboard; added `/notifications`, `/documents`, and a redirect from `/account/settings` |
| `Sidebar.jsx` | The hard-coded `badge: 3` on Notifications is now the live unread count |

New files:

```text
src/routes/RoleHome.jsx                     role-aware redirect
src/pages/client/ClientNotifications.jsx    notification centre (All / Unread, mark read,
                                            mark all read, dismiss, click-through)
src/pages/client/ClientDocuments.jsx        client file workspace with authenticated download
src/components/shared/ErrorState.jsx        localised errors with Retry; 403/404/offline variants
src/components/shared/Skeleton.jsx          Skeleton + SkeletonList
src/hooks/useUnreadCount.js                 polled unread badge
```

### Three more contract notes found while building these

1. **The notification model is snake_case** (`user_id`, `link_url`, `is_read`, `created_at`)
   while Files, Projects and most others are camelCase. `notifications.api.js` adapts it at
   the boundary, exactly as `06_BACKEND_ALIGNMENT.md` §13 asks — nothing downstream writes
   `n.is_read ?? n.isRead`.
2. **`/notifications/unread-count`** may return a bare number or a wrapper object;
   `getUnreadCount()` handles both and always resolves to a number.
3. **`/account/settings` was a second dead link** (the sidebar's Account Settings item) —
   the page lives at `/settings/account`. Redirected rather than moved, so nothing else breaks.

### Decision to confirm

Staff routes are currently guarded as `allow={[STAFF, ADMIN]}` — an admin can open the staff
workspace. If admins should be locked out of `/staff/*`, drop `ADMIN` from that one guard in
`App.jsx`.

### What can be tested now

With the backend running and `VITE_API_BASE_URL` set: sign in as each user type, confirm the
right workspace loads, confirm a client is bounced from `/admin` to `/no-access`, and confirm
the notification badge, notification centre and document download work end to end. Everything
else is still on mock data and untouched.


---

## 10. Third pass — Projects slice (list surfaces)

### Adapter layer

`src/api/adapters/project.js` is the single place where an API project becomes the shape
the existing cards, rows and tables already expect — `progressPercent` → `progress`,
`client.name` → `clientName`, `services[]` → names, `currentWork*` → a `currentWork` object,
plus formatted `deadline` and relative `updatedAt`. Components were not rewritten to match
the backend; the adapter was written to match the components.

New hooks in `src/hooks/useProjects.js`: `useProjects`, `useProject`,
`useProjectsNeedingAttention`, `useClientOptions`. Plus `useDebouncedValue` so typing in a
search box doesn't fire a request per keystroke.

### Pages wired

| Page | What changed |
|---|---|
| `StaffProjects.jsx` | Real data, scoped with `staffId: user.id` so staff see their own assignments. Skeleton, error-with-retry, and two different empty states (no results vs no assignments). Search, client and status go to the server |
| `AdminProjects.jsx` | Real data across the portfolio, same states. Portfolio stat cards now derive from loaded projects. Client lookup comes from the adapter rather than a mock lookup table |

### Three things found while wiring

1. **`GET /projects` does not include deliverables or team members.** Only `client` and
   `services`. So deliverable counts are `null` on list responses, and the adapter returns
   null rather than a misleading `0/0` — the Timeline view now hides the counter instead of
   showing zeros. If the list is meant to show "12/16 deliverables", the include needs adding
   server-side.
2. **There is no project owner on the backend.** `ProjectRow` rendered an Owner column from
   `project.ownerId` / `assigneeId`, neither of which exists on the model — team membership is
   a plain many-to-many with a `roleOnProject` string. The column currently shows the first
   assigned member. Either add an owner to the model or relabel the column "Team".
3. **`AdminProjects` had a dead status filter.** The predicate read
   `statusFilter === statusFilter`, which is always true, so clicking a status chip did
   nothing. Fixed as part of the wiring.

### Still on mock data

`pages/client/Projects.jsx` was left alone deliberately. Unlike the staff and admin lists it
isn't a list page — it's a bespoke prototype with an embedded video player, timeline steps and
its own inline data shape that has no backend equivalent. Wiring it is a redesign decision,
not a migration, and is worth a conversation before anyone starts.

`mockData.js` is still in place and still used by the pages that haven't migrated.

### Next

`ProjectDetail.jsx` — the project workspace `03_UI_UX_IMPROVEMENT.md` §4 describes
(Overview / Work / Tasks / Deliverables / Approvals / Files / Team / Activity / Billing).
`useProject(id)` already returns everything the header and Overview tab need.


---

## 11. Fourth pass — ProjectDetail (client project workspace)

`pages/client/ProjectDetail.jsx` is now real-data-driven end to end: project header,
progress, current work, services, deliverables, team, billing and the review CTA.

### New adapters and hooks

- `api/adapters/invoice.js` — `adaptInvoice`, `adaptTransaction`, `summarizeInvoices`,
  `formatCurrency`. Rolls a project's invoices into one `{ total, paid, outstanding,
  transactions }` summary for the billing panel.
- `api/adapters/project.js` gained `adaptTeamMember` and `adaptDeliverable`. Team members
  now carry `name`/`initials`/`role` regardless of whether the backend supplied a stored
  `initials` value or just first/last name.
- `hooks/useProjectBilling.js` — invoices for one project, summarised.
- `hooks/useProjectApprovals.js` — approvals for one project, plus a `pending` slice used
  to point the "Review" CTA at the actual pending approval instead of a dead button.

### What was replaced

| Was | Now |
|---|---|
| `getProjectById()` / mock `teamMembers` | `useProject(projectId)` — includes client, services, teamMembers, deliverables in one call |
| Hard-coded `paymentData` object (two fake transactions) | `useProjectBilling(projectId)` against real invoices/transactions |
| `Array.from({ length: totalDeliverables })` — deliverables were never real rows, just a count turned into placeholder boxes | `project.deliverables.map(...)`, with an empty state when there are none |
| Dead "Review" `<button>` with no handler | `<Link>` to `/approval/:id` for the first pending approval, or `/approvals` as a fallback |
| No not-found / forbidden / error states | All four states (loading, not-found, forbidden, error) plus Retry |

### Contract notes from this pass

1. **The invoice and payment-transaction models are entirely snake_case**
   (`invoice_number`, `client_id`, `amount_paid`, `due_date`, `paid_at`...) — the second
   model after notifications where this matters. Handled once in `adaptInvoice`.
2. **`GET /projects/:id` already includes deliverables and team members** (unlike the list
   endpoint — see §10.1). Single-project pages don't have the null-count problem list pages do.
3. **The User model has a stored `initials` field.** `adaptTeamMember` prefers it and only
   computes initials from first/last name as a fallback, matching what the backend actually
   does rather than re-deriving something it already provides.
4. **Payments are still assembled by fetching every invoice for a project and flattening
   their transactions client-side** — there is no dedicated "payments for project" endpoint.
   Fine at project scale; the admin all-payments view (§5.1) will need a real backend
   endpoint rather than this pattern fanned out across every invoice in the system.

### Deliberately left as-is

The `/project/:projectId/pay` payment flow was not touched — it's a separate page and a
separate piece of work (recording a payment, not just displaying billing history).

### Next

Staff/Admin project detail — currently there's no equivalent page; `03_UI_UX_IMPROVEMENT.md`
§4 calls for the full tabbed workspace (Overview / Work / Tasks / Deliverables / Approvals /
Files / Team / Activity / Billing). `useProject`, `useProjectBilling` and
`useProjectApprovals` already carry everything the Overview and Billing tabs need; Tasks and
Files tabs will need `tasksApi.listTasks({ projectId })` and `filesApi.listFiles({ projectId
})` respectively.


---

## 12. Fifth pass — Staff/Admin project workspace (new page)

There was no staff or admin project detail page at all before this — clicking a project row
in either list went nowhere. Built per `03_UI_UX_IMPROVEMENT.md` §4 and
`07_CLAUDE_HANDOFF.md`'s tab list.

### New files

```text
src/components/project/ProjectWorkspace.jsx   shared workspace, parameterised by role
src/pages/staff/StaffProjectDetail.jsx        <ProjectWorkspace backTo="/staff/projects" role="staff" />
src/pages/admin/AdminProjectDetail.jsx        <ProjectWorkspace backTo="/admin/projects" role="admin" />

src/api/adapters/task.js       resolves assignee/project/client relations
src/api/adapters/approval.js   adds a computed `waitingSince`
src/api/adapters/activity.js   maps activityType -> the icon key ActivityItem already reads
src/api/adapters/file.js       resolves uploader

src/hooks/useProjectWorkspace.js   useProjectTasks, useProjectFiles, useProjectActivity
```

`useProjectApprovals` (added in pass 4) is reused as-is; it now adapts through
`adaptApproval` instead of returning raw rows.

Routes added: `/staff/project/:projectId`, `/admin/project/:projectId`. Both project list
pages now navigate to their respective workspace on row/card click — previously `AdminProjects`'
open button and both `StaffProjects` row/card had no click handler at all.

### Tabs

Overview, Work, Tasks, Deliverables, Approvals, Files, Team, Activity — plus **Billing for
admin only**, per `00_PROJECT_MASTER.md` §3 ("Staff should not be overloaded with
financial/admin controls"). Client keeps its separate `ProjectDetail.jsx` — deliberately not
merged into this component, since the client's page is presentation-first (per §16 of the UX
spec) and this one is operational/dense; they're different information architectures, not
the same page with a role flag.

### Scope: read-only by design

Every tab here reads; none of them mutate yet. Tasks show status and priority as badges but
there's no status-change control, approvals show status but no review action, and there's no
"create task" / "create approval" / "assign staff" button anywhere on the page. That's
deliberate — `05_IMPLEMENTATION_PLAN.md` sequences Tasks and Approvals as their own vertical
slices (Phases 4–5) precisely because the mutation UX (optimistic updates, confirmation on
destructive actions, cache invalidation across project/task/notification) is real work of its
own, not something to bolt onto a workspace page in passing.

### Two decisions worth confirming

1. **No project-owner field**, again (see §10.2) — the workspace header doesn't show one for
   the same reason `AdminProjects`' Owner column doesn't: it isn't in the model.
2. **The "Open Tasks" stat card** counts everything not `completed`/`cancelled` from the
   already-loaded task list rather than calling a separate count endpoint. Fine at current
   scale; revisit if project task lists grow past what one page fetch should hold.

### Next

Tasks (Phase 4) or Approvals+Files (Phase 5) as real vertical slices — status transitions,
the approve/request-changes/reject actions already stubbed out in `approvals.api.js`, task
creation, and file upload. Either is a reasonable next step; Approvals has a slight edge
since `reviewApproval()` and the three convenience wrappers already exist and only need a UI.


---

## 13. Sixth pass — Approvals mutation flow, and two backend bugs found along the way

This pass wired the actual review workflow (approve / request changes / reject) across all
three roles. Building it surfaced two backend defects severe enough to fix rather than just
document — both are in `backend/`, alongside the frontend changes.

### Backend fix 1 — client-scoping was silently broken (fixed)

`approvals.service.ts` and `tasks.service.ts` both scope client-visible data with
`requester.clientId`. But `AuthenticatedUser` — what `JwtStrategy.validate()` builds from the
JWT — never had a `clientId` field, and nothing ever set one. Two failure modes from the same
missing claim:

- **List endpoints** (`findAll`): `where.clientId = undefined` is silently dropped by
  Sequelize, so a client-authenticated user's `GET /approvals` and `GET /tasks` returned
  every client's rows, not just their own. Cross-tenant data exposure.
- **Single-resource checks** (`findOne`, `review`, `versionHistory`): `assertClientCanAccess`
  compares `approval.clientId !== requester.clientId`, i.e. `<uuid> !== undefined`, which is
  always `true`. Every client attempting to view or review *any* approval got a 403. The
  approval review feature was completely non-functional for real client accounts, not just
  unscoped.

Fixed by embedding `clientId` in the JWT at login, the same way permissions already are:

- `ClientsService.findClientIdForUser(userId)` — new method, looks up the user's
  `ClientContact` row.
- `AuthModule` now imports `ClientsModule`.
- `AuthService.signToken()` resolves `clientId` for `userType === CLIENT` and signs it into
  the payload.
- `JwtStrategy.validate()` passes it through onto `request.user`.
- `AuthenticatedUser` / `JwtPayload` types gained an optional `clientId`.

Trade-off carried over from how permissions already work: this is stale until the user
re-logs in or `/auth/refresh` runs — a client added to `ClientContact` after their last login
won't be scoped until then. Same trade-off the codebase already accepted for permissions;
consistent, not new.

### Backend fix 2 (partial) — `ParseIntPipe` against UUID primary keys

**Every model in the backend uses a UUID primary key** — confirmed across all 33 model files.
**Every controller parses `:id`-shaped route params with `ParseIntPipe`** — 135 occurrences
across 20 controller files, with zero exceptions. `ParseIntPipe` rejects anything that isn't a
plain integer string, so `GET /approvals/:id`, `PATCH /projects/:id`, `DELETE /tasks/:id` — the
large majority of single-resource routes in the API — return 400 for any real UUID. This
almost certainly means **most single-resource GET/PATCH/DELETE endpoints in this backend do
not work today** against real data, regardless of anything built on top of them.

**Fixed only in `approvals.controller.ts`** (`ParseIntPipe` → `ParseUUIDPipe`, `id: number` →
`id: string`, same for `deliverableId`) — that's what the review feature needed. The other 19
controllers were left untouched. This was a deliberate scope decision, not an oversight:

- The pattern is completely uniform in controllers, so a scripted fix is low-risk there.
- But roughly 60 service-layer methods across ~15 files also type `id` as `number` while
  actually receiving what will become a UUID string once controllers are fixed — and that
  typing is *not* uniformly wrong the way the controller pattern is (approvals.service.ts, for
  instance, already correctly types `findOne(id: string)` — only its controller was wrong).
  Sweeping every file requires checking each one rather than a blind find-replace.
- This environment has no `node_modules` and no way to run `nest build` / `tsc --noEmit`, so a
  60-site cross-cutting change could not be type-checked before handing it back.

**This is the single highest-priority backend defect found across every pass so far.** Before
wiring any more single-resource routes (Tasks status updates, Files download/delete, Project
update, anything hitting `PATCH/DELETE .../:id`), this needs a dedicated pass: swap
`ParseIntPipe` → `ParseUUIDPipe` and `number` → `string` controller-by-controller, verify each
service's `id` typing matches, then a full `nest build`. Happy to do that as its own piece of
work — it's mechanical but wants a compiler to check it, and touches every module.

### Frontend: the review flow itself

- `hooks/useApprovalReview.js` — wraps `approve`/`requestChanges`/`reject` as three
  independent mutations (a card mid "request changes" doesn't share a busy flag with a
  sibling card's approve button). Feedback is required for anything but approve, matching
  `ReviewApprovalDto`'s server-side validation.
- `ClientApprovals.jsx` — real data, inline approve/request-changes per pending card, a real
  file preview/download when the approval has an attached file, links through to the detail
  page. History section now shows real status (including `changes-requested`, which the mock
  version never modeled) and the actual feedback text.
- `ClientApprovalViewPage.jsx` — fully rewritten. Two prototype features had no backend
  equivalent and were replaced rather than wired:
  - A fabricated "cinematic video player" with a hardcoded filename/duration/progress bar →
    replaced with an honest file panel showing the real attached file (name, type, size,
    version) and a real download action.
  - A fabricated multi-turn comment thread with a composer → the Approval model has one
    `feedback` string, set once at review time, not a conversation. Replaced with a single
    feedback panel. **A real approval discussion thread is a backend gap**, not something the
    frontend can synthesize — `04_MODULE_REQUIREMENTS.md`'s Approval field list doesn't
    include comments either (only Tasks have a comments endpoint).
  - Version history now calls the real `GET /approvals/deliverables/:deliverableId/history`
    endpoint and only renders when a deliverable has more than one round.
- `components/approvals/ApprovalCard.jsx` (shared, staff-facing) — rewritten **read-only**.
  The backend enforces "Only the client can review an approval" server-side
  (`approvals.service.ts`), so the approve/reject buttons this component previously showed
  for staff would always 403. Replaced with status + a link to the project.
- `pages/staff/ApprovalList.jsx` — now fetches its own data with status filtering, instead of
  receiving a mock `approvals` prop from `App.jsx`.
- `pages/admin/AdminApprovals.jsx` — real data, server-side status and client filters,
  client-side search (the endpoint has no search param). Added `changes-requested` as a
  filter and status pill — the mock version only modeled pending/approved/rejected. Dropped
  the project-filter dropdown for this pass (it would need its own project list fetch); can
  be added the same way the client filter now works, via `useClientOptions`'s sibling.

### Two things intentionally left out

1. Admin/staff still have no way to *create* an approval request from the UI
  (`POST /approvals` exists in `approvals.api.js`, unused). Per the module docs this belongs
  on the deliverable it's requesting review for, i.e. inside `ProjectWorkspace`'s Deliverables
  tab, not this list page.
2. `AdminApprovals`' project filter dropdown, noted above.

### Next

Given what pass 6 found, **the ParseIntPipe sweep is now the most valuable next unit of
work** — it's very likely silently blocking Tasks status updates, file downloads, and most of
what Phase 4/5 would otherwise build on top of. After that, Tasks status transitions is the
natural continuation of the mutation pattern established here.
