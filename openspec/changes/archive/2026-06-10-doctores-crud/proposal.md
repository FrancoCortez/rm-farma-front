# Proposal: Doctores CRUD

## Intent

The user is building a Doctores CRUD inside the "Mantenedores" section of the
dashboard. The `DoctorResourceDto`, `DoctorCreateResourceDto`, and
`DoctorService` already exist but lack `update` and `delete` and the DTOs are
missing `code` and `enabled`. This is the first maintainer page with row-level
actions (edit + soft-delete) and the first soft-delete confirmation in the
repo — it sets the project-wide pattern for actions columns and destructive
confirmations.

## Scope

### In Scope

- Extend `DoctorResourceDto` with `code: number` and `enabled: boolean`.
- Extend `DoctorCreateResourceDto` with `code?: number` (OPTIONAL at the DTO
  level — see Risks). The new Doctores page enforces `Validators.required` on
  the form control; the deprecated `doctor-form.component.ts` consumer keeps
  working because it does not need to send it.
- Create `DoctorUpdateResourceDto` with `rut: string, name: string`
  (no `code` on update, per user contract).
- Extend `DoctorService` with `updateDoctor(id, dto) → PUT /doctor/:id` and
  `deleteDoctor(id) → DELETE /doctor/:id`. Keep singular endpoint paths
  (backward-compatible with `add-patient-v2` and `doctor-form.component`).
- Add `src/app/pages/maintainer/doctor/` (list + form dialog), service-only,
  no NgRx (user is phasing NgRx out).
- Register route `doctor` in `maintainer.routes.ts` (singular path, matches
  `schemas` / `pa` / `commercial-product` children — they all use direct
  `component:` imports, no child route files).
- Add menu entry "Doctores" under "Administración" in
  `src/assets/demo/data/menu-items.json` with `routerLink:
  ["/main/maintainer/doctor"]`.
- Unit tests for service, list component, and form dialog (Strict TDD on;
  first specs in `src/`).
- Reuse: `rutValidator`, `RutFormatterDirective`, `FormControlStatusDirective`,
  `FormValidationMessagesComponent`, `ModalSuccessComponent`,
  `ModalErrorComponent`, `SpinnerComponent`. Reuse `schemas.component` for
  toolbar + `p-table` layout; reuse `list-manufacture.component.html` line 496
  pattern (`p-button-rounded` + `pi pi-pencil`) for the actions column
  (`list-patient.component.html` only has a search-plus button, no edit/delete).
- **DO NOT migrate `doctor-form.component.ts` in this change** (out of scope —
  deprecated consumer, will be migrated or removed in a future SDD change).
  The DTO keeps `code?` optional so the legacy form continues to compile.

### Out of Scope

- NgRx work on `doctor-store` (phasing out; keep deep-path consumers as-is).
- Endpoint singular → plural migration (`/doctor` stays).
- Reactivate / enable-doctor flow (one-way soft delete for now).
- Hard delete, audit log, history, specialties, schedules.
- i18n (UI strings stay Spanish to match existing pages).
- Linter setup, coverage gates, e2e.

## Approach

**DTOs** (extend in place at `src/app/model/doctor/`): add fields directly to
existing files; create new `doctor-update-resource.dto.ts`.

**Service**: add `updateDoctor(id: string, dto: DoctorUpdateResourceDto)` and
`deleteDoctor(id: string)` to `src/app/services/doctor.service.ts`. Keep
`host = environment.hostRmFarma` and singular `/doctor` paths.

**Page** (`src/app/pages/maintainer/doctor/`): `doctor.component.ts/.html/.spec.ts`
(list page) and `doctor-form-dialog.component.ts/.html/.spec.ts` (create +
edit dialog — same dialog reused). Mirror the `schemas` folder structure
(standalone component, `templateUrl`, `OnInit`, `initDataTable`, `initColumns`,
`onGlobalFilter`, `confirmDialog`, `confirmDialogError`, `cancelModal`).
Register in `maintainer.routes.ts` as a direct `component:` import like the
other children.

**State**: local component state only (no NgRx): `doctorsList`,
`loadingReport`, `displayCreateDialog`, `displayEditDialog`,
`editingDoctor?: DoctorResourceDto`, `messageError`, `isLoadingUpdate`,
`displayOk`, `displayError`. Follow `schemas.component` field naming.

**Table**: `p-table` with `styleClass="p-datatable-gridlines"`,
`responsiveLayout="scroll"`, `[rowHover]="true"`, `dataKey="id"`, `[rows]="30"`,
paginator, `rowsPerPageOptions="[10,20,30,40,50]"`,
`currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Doctores"`,
`[globalFilterFields]="['rut','name','code']"`. Columns: RUT, Nombre, Código,
Estado (badge Activo/Inactivo from `enabled`), actions (pencil + trash).

**Edit flow**: pencil opens dialog pre-filled with `rut` and `name` only (no
`code` field on update per DTO). Save → `updateDoctor(id, formValue)` → close
dialog → `app-modal-success` → on `(confirm)` re-run `findAllDoctors`.

**Create flow**: "Nuevo" → dialog with rut, name, code — all `Validators.required`,
`rutValidator()` on rut, `[appRutFormatter]` on the input. Save →
`createDoctor(formValue)` → same success/refresh flow.

**Delete flow**: trash → `Swal.fire({ title: '¿Eliminar Doctor?', text: \`¿Está
seguro que desea eliminar a ${doctor.name}?\`, icon: 'warning',
showCancelButton: true, confirmButtonText: 'Sí, eliminar', cancelButtonText:
'Cancelar' })`. On confirm → `deleteDoctor(id)` → on success re-run
`findAllDoctors`; on error (400: `err.error.errors`, 500/other: generic
message) show `app-modal-error`.

**Migration of existing consumer**: NONE in this change. The DTO keeps `code?`
optional; the legacy `doctor-form.component.ts` form keeps its 2-field payload
and continues to type-check. A future SDD change (out of scope) will either
migrate or remove `doctor-form`. The new Doctores page enforces `code` as
required at the **form-control level** (not the DTO level) so the validation
lives where it belongs.

**Style**: `card px-6 py-6` page chrome, PrimeFlex utilities, no per-page CSS.

**Tests** (RED → GREEN → REFACTOR):
- `src/app/services/doctor.service.spec.ts` — `HttpClientTestingModule` +
  `HttpTestingController`. Assert verb, URL, and body for all five methods
  (`findAllDoctors`, `findDoctorByRut`, `createDoctor`, `updateDoctor`,
  `deleteDoctor`).
- `src/app/pages/maintainer/doctor/doctor.component.spec.ts` — TestBed;
  smoke: renders the table, opens create, opens edit pre-filled, opens
  delete confirmation, calls the right service method on save.
- `src/app/pages/maintainer/doctor/doctor-form-dialog.component.spec.ts` —
  form invalid when required empty, rut rejects invalid + accepts valid,
  save emits correct payload (create vs update branches).

## Affected Areas

| Path | Action | Why |
| --- | --- | --- |
| `src/app/model/doctor/doctor-resource.dto.ts` | modify | Add `code`, `enabled`. |
| `src/app/model/doctor/doctor-create-resource.dto.ts` | modify | Add `code`. |
| `src/app/model/doctor/doctor-update-resource.dto.ts` | create | New update payload. |
| `src/app/services/doctor.service.ts` | modify | Add `updateDoctor`, `deleteDoctor`. |
| `src/app/services/doctor.service.spec.ts` | create | Service unit tests. |
| `src/app/pages/maintainer/doctor/doctor.component.ts` | create | List page. |
| `src/app/pages/maintainer/doctor/doctor.component.html` | create | List template. |
| `src/app/pages/maintainer/doctor/doctor.component.spec.ts` | create | Page smoke tests. |
| `src/app/pages/maintainer/doctor/doctor-form-dialog.component.ts` | create | Create/edit dialog. |
| `src/app/pages/maintainer/doctor/doctor-form-dialog.component.html` | create | Dialog template. |
| `src/app/pages/maintainer/doctor/doctor-form-dialog.component.spec.ts` | create | Form + validator tests. |
| `src/app/pages/maintainer/maintainer.routes.ts` | modify | Add `doctor` child. |
| `src/assets/demo/data/menu-items.json` | modify | Add Doctores under Administración. |

## Risks

- **Existing consumer (`doctor-form.component.ts`) is deprecated** —
  the form is no longer used in production for creating doctors. It still
  exists in the codebase and builds `DoctorCreateResourceDto` from a 2-field
  form (verified at line 106-109, 157). The DTO keeps `code?` optional so the
  legacy form continues to type-check. A future SDD change (out of scope here)
  will either migrate or remove `doctor-form`. Flagged in the Open Questions
  section as a known follow-up.
- **First row-level actions in the repo** — no in-repo pattern exists. The
  user pointed at `list-patient.component.html`; the actual edit button
  pattern lives at `list-manufacture.component.html:496`
  (`p-button-rounded p-button-info icon="pi pi-pencil"`). The proposal
  follows the manufacture pattern (not patient) and adapts to warning/danger
  variants.
- **First soft delete + first `Swal.fire` confirmation** — no in-repo
  precedent. Proposal introduces it as the project-wide confirmation pattern.
  Future pages should reuse.
- **0 specs in `src/`** — first test run will surface Karma/Jasmine config
  issues. Fix in this change, not defer.
- **Bundle budgets** — small page, well under 1mb; verify with
  `ng run build` before finishing.
- **Endpoint singular divergence** — `doctor` singular vs rest of repo
  plural. Stays as-is for backward compatibility; future cleanup change
  standardizes.
- **No ESLint** — manual style: 2-space indent, single quotes `.ts`, UTF-8,
  final newline.
- **RUT validator is Chilean-specific** — flagged for future generalization
  if business expands.
- **`code` field semantics unconfirmed** — the user did not specify max
  length or pattern. The proposal assumes a 4-digit numeric code (consistent
  with `commercial-product`) and flags this as a small decision in the spec
  phase. The Doctores page enforces `code` as `Validators.required` on the
  form control; the DTO leaves it optional so the legacy `doctor-form`
  consumer stays compiling.

## Open Questions

- **Route child name** — confirmed singular `doctor` (matches existing
  children `schemas`, `pa`, `commercial-product`; singular backend path).
  Menu label stays plural "Doctores" per user approval.
- **`code` field validation** — to be decided in `sdd-spec`: max length,
  pattern (numeric only?), and whether the backend assigns or the user
  provides. The Doctores page form will enforce `Validators.required` and
  the spec must lock the bounds. DTO field stays optional.
- **NgRx migration path** — out of scope, but `doctor-store` continues to be
  used by `add-patient-v2` and `doctor-form`. The new CRUD page does NOT
  touch it. A future change will remove the store.
- **`doctor-form.component.ts` is deprecated and untouched here** — the
  legacy inline-create flow stays in place. A follow-up SDD change (NOT
  this one) will migrate it to include `code` and the new shape, or remove
  it entirely. Tracked here as a known follow-up.

## Acceptance Criteria

- "Doctores" entry appears under "Administración" in the sidebar.
- Clicking it loads a paginated table of doctors with columns RUT / Nombre /
  Código / Estado (badge derived from `enabled`).
- User can create a new doctor (3 fields: rut with RUT validation, name,
  code).
- User can edit an existing doctor's RUT and name (code is not editable).
- User can delete a doctor with a confirmation prompt; list refreshes after
  each successful operation.
- Existing patient flows (`add-patient-v2`, `doctor-form`) still work without
  changes; `ng build` passes.
- All new behavior has corresponding `*.spec.ts` files; `npm test
  -- --watch=false --browsers=ChromeHeadless` is green.

## Rollback Plan

Revert the single PR. DTO extensions are additive only (`code?` is optional on
`DoctorCreateResourceDto`, `code` and `enabled` are new on the resource
DTO), so the legacy `doctor-form` consumer is unaffected. New files in
`src/app/pages/maintainer/doctor/` and `doctor.service.spec.ts` are
self-contained and revert cleanly. The route entry in
`maintainer.routes.ts` and the menu entry in `menu-items.json` revert with
the rest.
