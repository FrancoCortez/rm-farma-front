# Design: Doctores CRUD

## Technical Approach

Standalone, service-only Angular 17 page under `src/app/pages/maintainer/doctor/`
that mirrors the `schemas` / `commercial-product` pattern (toolbar + `p-table` +
reactive-form `<p-dialog>` + modals/spinner) and adds the first row-level
actions column (edit + delete) and the first `Swal.fire` confirmation in the
repo. The DTO layer is extended in place (additive only); the service gets two
new methods (`updateDoctor`, `deleteDoctor`); a new update DTO is created.
NgRx `doctor-store` is **not** touched.

This document is the bridge between the proposal (intent + scope) and
`sdd-tasks` (reviewable work units). The locked decisions, delta specs, and
existing in-repo patterns cited below are the only inputs; `sdd-tasks` should
not re-derive any choice documented here.

## Architecture Decisions

### Decision: Service-only data flow (no NgRx for the new page)

**Choice**: `DoctorComponent` and `DoctorFormDialogComponent` call
`DoctorService` directly. Local component state only.
**Alternatives considered**: dispatch through the existing
`src/app/root-store/doctor-store/` slice (consistent with the legacy
`add-patient-v2` and `doctor-form` consumers).
**Rationale**: locked decision in the proposal; the team is phasing NgRx out
for new features. The legacy slice continues to back its existing consumers —
see [NgRx boundary](#4-ngrx-boundary).

### Decision: Single form dialog reused for create and edit

**Choice**: `DoctorFormDialogComponent` accepts a `mode: 'create' | 'edit'`
input and a `doctor?` input. In `edit` mode the `code` control is disabled and
excluded from the emitted payload. Output: `(save) → emits payload`,
`(cancel) → emits void`.
**Alternatives considered**: two separate dialog components
(`DoctorCreateDialogComponent`, `DoctorEditDialogComponent`).
**Rationale**: the form shape differs by exactly one control (no `code` on
edit). One component with a `mode` discriminator keeps the validators and
markup DRY. Locks `DoctorUpdateResourceDto` as `{ rut, name }` only.

### Decision: `code` enforced as required at the form-control level only

**Choice**: `DoctorCreateResourceDto.code?: number` stays optional; the
form control wires `Validators.required` + a numeric `1..99999` validator.
**Alternatives considered**: making `code` required at the DTO level and
migrating `doctor-form.component.ts` in the same change.
**Rationale**: locked decision — `doctor-form.component.ts` is deprecated and
explicitly out of scope. Additive DTO shape keeps its 2-field `createDoctor`
call compiling. Numeric range 1..99999 is locked in `doctor-resource` spec.

### Decision: Hand-written actions column, not `cols`-driven

**Choice**: The Doctores `p-table` body template declares five `<td>` cells
manually (RUT, Nombre, Código, Estado, Acciones) rather than the
`*ngFor="let col of columns"` loop used by `schemas.component.html`.
**Alternatives considered**: keep `cols: any[]` driven and append an "actions"
column with a render callback.
**Rationale**: the actions cell needs to host two `<button>`s that call
component methods, and the Estado cell needs a conditional badge — neither
fits the `parseFieldInData` pattern. Matches the precedent at
`list-manufacture.component.html:496` (a leading hand-written `<td>` of
action buttons). The actions `<th>` is also added by hand above the column
loop. See [Risks for design phase](#7-risks-for-design-phase).

### Decision: Raw `Swal.fire` for the delete confirmation

**Choice**: Import `Swal` from `sweetalert2` (already in `node_modules` as a
transitive dep of `@sweetalert2/ngx-sweetalert2`) and call `Swal.fire(...)`
in `confirmDelete(doctor)`. The success/error modals continue to use the
existing `<app-modal-success>` and `<app-modal-error>` components.
**Alternatives considered**: build a `<p-confirmDialog>` PrimeNG dialog;
use the `@sweetalert2/ngx-sweetalert2` `<swal>` directive.
**Rationale**: the proposal locks the exact `Swal.fire` shape
(`title: '¿Eliminar Doctor?'`, `text: \`¿Está seguro que desea eliminar a ${name}?\``,
`icon: 'warning'`, `showCancelButton: true`, `confirmButtonText: 'Sí, eliminar'`,
`cancelButtonText: 'Cancelar'`). The `<swal>` directive can render a static
popup but is awkward for a per-row `text`; the raw `Swal.fire` API is the
cleanest fit and is the user-locked shape. **Side effect**: the spec adds
`sweetalert2` as a direct (not just transitive) dep — see
[Risks for design phase](#7-risks-for-design-phase).

### Decision: TestBed uses a `DoctorService` spy, not `HttpClientTestingModule`

**Choice**: `doctor.component.spec.ts` and `doctor-form-dialog.component.spec.ts`
inject a jasmine spy object for `DoctorService`. Only `doctor.service.spec.ts`
uses `HttpClientTestingModule` + `HttpTestingController`.
**Rationale**: keeps component specs fast and focused on the component
contract (UI state, method dispatch, dialog flow). Service spec owns the
HTTP contract. Matches the spec's explicit guidance.

## Component Composition and Data Flow

### Page lifecycle

`ngOnInit` runs `initColumns()` (builds `cols: ColumModelDto[]` with
`{ field: 'rut', header: 'RUT' }`, `{ field: 'name', header: 'Nombre' }`,
`{ field: 'code', header: 'Código' }`) and then `initDataTable()` which sets
`loadingReport = true`, calls `doctorService.findAllDoctors().subscribe(...)`,
assigns the response to `doctorsList` on next, and sets
`loadingReport = false` on complete. The `doctorsList` is bound to the
`<p-table [value]="doctorsList">`.

### Create flow

`openCreateDialog()` flips `displayCreateDialog = true`. The form dialog
component lives in the template with `[mode]="'create'"` and
`[doctor]="undefined"`. The dialog's `ngOnInit` (or `ngOnChanges`) builds a
form with three controls. When the user clicks "Guardar" and the form is
valid, the dialog emits `(save)` with the trimmed payload. The page then sets
`isLoadingUpdate = true` and calls
`doctorService.createDoctor({ rut, name, code })`. On `next` it sets
`displayCreateDialog = false`, `isLoadingUpdate = false`, `displayOk = true`.
On `error` it sets `messageError` per the existing schemas pattern (400 →
`err.error.errors`; 500 → generic; other → generic), then `displayError = true`
and `isLoadingUpdate = false`.

### Edit flow

`openEditDialog(doctor)` assigns `editingDoctor = doctor` and flips
`displayEditDialog = true`. The form dialog is rendered with
`[mode]="'edit'"` and `[doctor]="editingDoctor"`; on init the dialog
`patchValue({ rut, name })` and **disables** the `code` control (which is
not even present in the edit form shape — see [Decision: Single form dialog
reused for create and edit](#decision-single-form-dialog-reused-for-create-and-edit)).
On save, the page calls
`doctorService.updateDoctor(editingDoctor.id, { rut, name })` with the same
success/error + modals/spinner pattern as create.

### Delete flow

`confirmDelete(doctor)` calls `Swal.fire(...)` with the locked shape. The
`.then((result) => { ... })` branch inspects `result.isConfirmed`. On
confirm: `isLoadingUpdate = true`, call
`doctorService.deleteDoctor(doctor.id)`, same success/error pattern. On
cancel: no-op, no service call, `isLoadingUpdate` untouched.

### Refresh after success

`confirmDialog($event: boolean)` is wired to `<app-modal-success>`'s
`(confirm)`. It hides the success modal and runs `initDataTable()` to
re-fetch the list. `confirmDialogError($event)` is wired to
`<app-modal-error>`'s `(confirm)` and only flips `displayError = false`.

## State Machine

```
ngOnInit
  └─→ initColumns() → initDataTable()
        loadingReport = true
        doctorService.findAllDoctors()
          ├─ next  → doctorsList = resp
          ├─ error → console.error
          └─ complete → loadingReport = false

openCreateDialog()
  └─→ displayCreateDialog = true
        (dialog mode='create', doctor=undefined)

form.save (create)
  isLoadingUpdate = true
  doctorService.createDoctor({ rut, name, code })
    ├─ next      → displayCreateDialog = false
                    isLoadingUpdate = false
                    displayOk = true
                      └─ (confirm) → confirmDialog($event)
                                      initDataTable()
    ├─ error     → messageError = (400? err.error.errors : generic)
                    displayError = true
                    isLoadingUpdate = false
    └─ complete  → isLoadingUpdate = false

openEditDialog(doctor)
  └─→ editingDoctor = doctor
        displayEditDialog = true
        (dialog mode='edit', doctor=editingDoctor, code control disabled)

form.save (edit)
  isLoadingUpdate = true
  doctorService.updateDoctor(editingDoctor.id, { rut, name })
    ├─ next      → displayEditDialog = false
                    isLoadingUpdate = false
                    displayOk = true
                      └─ (confirm) → confirmDialog($event)
                                      initDataTable()
    ├─ error     → messageError = (400? err.error.errors : generic)
                    displayError = true
                    isLoadingUpdate = false
    └─ complete  → isLoadingUpdate = false

confirmDelete(doctor)
  └─→ Swal.fire({ title, text, icon, showCancelButton, confirmButtonText, cancelButtonText })
        ├─ confirm → isLoadingUpdate = true
                      doctorService.deleteDoctor(doctor.id)
                        ├─ next    → displayOk = true
                                      (confirm) → initDataTable()
                        ├─ error   → messageError = (400? err.error.errors : generic)
                                      displayError = true
                        └─ complete → isLoadingUpdate = false
        └─ cancel  → no-op

cancelModal() → displayCreateDialog/Edit = false, form.reset()
confirmDialogError($event) → displayError = false
```

## 4. NgRx Boundary

The existing `doctor-store` slice under
`src/app/root-store/doctor-store/` is **not** modified. The new
`DoctorComponent` and `DoctorFormDialogComponent` do not import from
`@ngrx/store`, `@ngrx/effects`, or any path under
`src/app/root-store/doctor-store/`. The two legacy consumers stay
unaffected because (a) `DoctorCreateResourceDto.code?` is optional at the
DTO level so `diagnosis-patient-form/doctor-form.component.ts:106-109, 157`
keeps compiling with its 2-field payload, and (b) `DoctorResourceDto`
gains `code` and `enabled` but those consumers only read `id` and `name`
(verified at `doctor-form.component.ts:118`). `ng build` must remain
green — covered by the `doctor-store-untouched` delta spec.

## 5. Routing & Menu Wiring

### `src/app/pages/maintainer/maintainer.routes.ts`

Add one line to the existing `export default [ ... ] as Routes` array,
matching the direct `component:` import style of the existing children:

```ts
import { DoctorComponent } from './doctor/doctor.component';
// ...
{ path: 'doctor', component: DoctorComponent },
```

`path: 'doctor'` is singular (matches `schemas` / `pa` / `commercial-product`).
No `loadChildren`, no child route file. Insertion order does not matter for
routing; placing it after `commercial-product` keeps the file diff minimal.

### `src/assets/demo/data/menu-items.json`

Append one entry under the existing "Administración" `items` array
(currently contains `Esquemas`, `Principios Activos`, `Marca Comercial`).
The diff adds a fourth object literal with the exact shape below; do not
reformat the rest of the file:

```json
      {
        "label": "Doctores",
        "icon": "pi pi-fw pi-id-card",
        "routerLink": ["/main/maintainer/doctor"]
      }
```

Indentation matches the other Administración entries (6 spaces from the
opening `[` of the `items` array).

## 6. Test Plan (Strict TDD)

All new specs land **before** implementation (RED → GREEN → REFACTOR).
`tsconfig.spec.json` already includes `src/**/*.spec.ts`; the `test`
target in `angular.json` uses `@angular-devkit/build-angular:karma` with
defaults (no custom `karma.conf.js`). Verify command:
`npm test -- --watch=false --browsers=ChromeHeadless`. Build command:
`npm run build`.

### `src/app/services/doctor.service.spec.ts` (new)

`TestBed.configureTestingModule({ imports: [HttpClientTestingModule],
providers: [DoctorService] })`. Inject `HttpTestingController` and
`DoctorService`. Five happy-path scenarios mapped to
`doctor-service/spec.md`:

| # | Method | HTTP assertion |
| - | ------ | -------------- |
| 1 | `findAllDoctors()` | `httpMock.expectOne('${host}/doctor').flush([{...}])` — emits array. |
| 2 | `findAllDoctors()` empty | `httpMock.expectOne(...).flush([])` — emits `[]`. |
| 3 | `findDoctorByRut('11.111.111-1')` | `httpMock.expectOne('${host}/doctor/find-by-rut/11.111.111-1').flush({...})`. |
| 4 | `createDoctor({ rut, name, code })` | `httpMock.expectOne('${host}/doctor', 'POST')` — verify `req.request.body === { rut, name, code }`. |
| 5 | `updateDoctor('d-1', { rut, name })` | `httpMock.expectOne('${host}/doctor/d-1', 'PUT')` — verify body has no `code` field. |
| 6 | `deleteDoctor('d-1')` | `httpMock.expectOne('${host}/doctor/d-1', 'DELETE').flush(null)` — completes. |
| 7 | `deleteDoctor('d-1')` 500 | `httpMock.expectOne(...).flush({}, { status: 500, statusText: 'Server Error' })` — observable errors. |

The `host` is `environment.hostRmFarma`; the test does **not** need to mock
`environment` because the assertion is built from the same imported
constant.

### `src/app/pages/maintainer/doctor/doctor.component.spec.ts` (new)

`TestBed.configureTestingModule({ imports: [DoctorComponent],
providers: [{ provide: DoctorService, useValue: doctorServiceSpy }] })`.
Standalone component is imported directly. The spy object is
`jasmine.createSpyObj<DoctorService>('DoctorService',
['findAllDoctors', 'findDoctorByRut', 'createDoctor', 'updateDoctor',
'deleteDoctor'])`. Because the template uses `Swal.fire` for delete and
`<app-modal-success>` / `<app-modal-error>` and `<app-spinner>`, the
spec imports the relevant standalone components and **also** mocks
`Swal` (the simplest approach: import `sweetalert2`, then assign
`(Swal as any).fire = jasmine.createSpy('fire').and.returnValue(
Promise.resolve({ isConfirmed: true, isDismissed: false }))` inside
`beforeEach`, restoring in `afterEach`).

Scenarios mapped to `doctor-page/spec.md`:

| # | Scenario | Assertion |
| - | -------- | --------- |
| 1 | Table renders on init | `ngOnInit` → `doctorServiceSpy.findAllDoctors` called; flush with one row; assert cell text. |
| 2 | Open create dialog | click "Nuevo" → `displayCreateDialog = true`. |
| 3 | Submit valid create | fill form (rut/name/code valid), click "Guardar" → `doctorServiceSpy.createDoctor` called with `{ rut, name, code }`; flush `next`; assert `displayCreateDialog = false`, `displayOk = true`. |
| 4 | Open edit pre-filled | click pencil on a row → `displayEditDialog = true`, `editingDoctor` matches; the dialog form is patched with that doctor's `rut` and `name`. |
| 5 | Submit valid edit | submit → `doctorServiceSpy.updateDoctor(doctor.id, { rut, name })` called (no `code` in payload). |
| 6 | 4xx surfaces backend error | flush error with `status: 400, error: { errors: ['msg'] }` → `displayError = true`, `messageError` contains 'msg'. |
| 7 | 5xx surfaces generic | flush error with `status: 500` → `messageError` is the generic Spanish string (not `err.error.errors`). |
| 8 | Confirm delete | click trash → `Swal.fire` called with the locked shape; resolve `{ isConfirmed: true }`; `deleteDoctor(id)` called; success → `displayOk = true`. |
| 9 | Cancel delete | resolve `{ isConfirmed: false }`; `deleteDoctor` **not** called. |

### `src/app/pages/maintainer/doctor/doctor-form-dialog.component.spec.ts` (new)

`TestBed.configureTestingModule({ imports: [DoctorFormDialogComponent] })`.
Render the component in a host wrapper that provides `mode` and `doctor`
inputs and captures `(save)` and `(cancel)` outputs. The dialog depends
only on `ReactiveFormsModule` and the form-validation components; no
service dependency in the dialog itself.

Scenarios mapped to `doctor-resource/spec.md`:

| # | Scenario | Assertion |
| - | -------- | --------- |
| 1 | Form is invalid when all empty | `component.form.invalid === true`. |
| 2 | Empty RUT → `required` error | `control.get('rut').errors` has `required`. |
| 3 | Invalid RUT check digit (`11.111.111-0`) | `control.get('rut').errors` has `invalidRut`. |
| 4 | Valid RUT (`11.111.111-1`) | `control.get('rut').valid === true`. |
| 5 | Empty `code` | `errors.required` on `code`. |
| 6 | `code = 0` | `code` invalid (range). |
| 7 | `code = 100000` | `code` invalid (range). |
| 8 | `code = 42` | `code` valid; `form.valid === true` (assuming rut + name valid). |
| 9 | Edit mode: `code` control disabled (or absent) | in mode `edit` the `code` control is disabled. |
| 10 | Save emit (create) | fill `{ rut, name, code: 42 }` → `(save)` emits `{ rut, name, code: 42 }`. |
| 11 | Save emit (edit) | fill `{ rut, name }` (code disabled) → `(save)` emits `{ rut, name }` only. |

### TestBed setup notes

- For service spec: `HttpClientTestingModule` is enough; no providers
  override needed.
- For component specs: import the standalone component under test plus
  the standalone dependencies it transitively uses (modals, spinner).
  Mock `DoctorService` with `jasmine.createSpyObj`. Mock `Swal` by
  reassigning `(Swal as any).fire` for the duration of the spec.
- For dialog spec: standalone only; no service or router mock needed.

## 7. Risks for Design Phase

- **First Karma+Jasmine run with specs in `src/`**. The runner is available
  but no spec has been written yet. The first
  `npm test -- --watch=false --browsers=ChromeHeadless` may surface Karma
  browser launcher issues on Windows (ChromeHeadless requires either a
  system Chrome or `puppeteer`/`karma-chrome-launcher`). No
  `karma.conf.js` exists — `angular.json` defers to defaults. If
  ChromeHeadless is missing, the sdd-apply phase must install
  `karma-chrome-launcher` and add `CHROME_BIN` (or rely on the
  Angular CLI's bundled `puppeteer`). Flag discovered during apply.
- **Promote `sweetalert2` to a direct dependency**. The proposal locks
  `Swal.fire(...)` for the delete confirmation, but the repo currently
  declares only `@sweetalert2/ngx-sweetalert2` in `package.json`. The
  bare `sweetalert2` package is present in `node_modules` only as a
  transitive dep. `sdd-tasks` MUST include a work unit that runs
  `npm install --save sweetalert2` (and matches the version on
  `package-lock.json`) before `import Swal from 'sweetalert2'` will
  type-check in the component. The proposal text does not call this out
  explicitly — flagged here for `sdd-apply` to handle in the bootstrap
  batch.
- **`p-table` actions column pattern deviation**. `schemas.component.html`
  drives cells from `cols: any[]`; the actions column requires a
  hand-written `<th>`/`<td>` outside that loop. Justified by the visual
  precedent at `list-manufacture.component.html:496`. The `cols` array
  remains useful for global filtering (`[globalFilterFields]`) and Excel
  export, so it is kept and augmented.
- **Route registration style**. `maintainer.routes.ts` uses direct
  `component:` imports (no child route files, no `loadChildren`). The
  proposal calls this out and the design follows it. If a future
  maintainer refactors that file to `loadChildren`, the Doctores entry
  must be updated in the same change.
- **0 specs means 0 coverage baseline**. Coverage is not gated (threshold
  = 0), but the new specs MUST land with the implementation per Strict
  TDD. The verify phase runs the full spec suite; coverage is a side
  effect, not the gate.
- **Bundle budget**. Doctores page adds one standalone component +
  dialog + ~1 service method. Well under the 500kb warn / 1mb error
  initial budget; verify with `npm run build` after the implementation
  lands.
- **RUT validator is Chilean-specific** (out of scope for this change
  but worth flagging in the archive's future-suggestion list).
- **Doctor store boundary**. The legacy `doctor-store` slice keeps being
  registered via `RootStoreModule`; the new CRUD page does not touch it.
  A future SDD change should remove the slice entirely.

## 8. Out of Scope (recap from proposal)

- NgRx work on `doctor-store` (legacy slice untouched).
- Endpoint singular → plural migration (`/doctor` stays).
- Reactivate / enable-doctor flow (one-way soft delete for now).
- Hard delete, audit log, history, doctor specialties, schedules.
- i18n (UI strings stay Spanish to match existing pages).
- Linter setup, coverage gates, e2e.
- `doctor-form.component.ts` migration (kept compiling thanks to additive
  DTO shape; follow-up SDD change).

## File-by-File Plan

### `src/app/model/doctor/doctor-resource.dto.ts` (modify)

Add two fields to the existing class. The class stays a plain TypeScript
class with optional fields, matching the existing style. Constructor is
not used today and stays absent.

Final shape:

```ts
export class DoctorResourceDto {
  id?: string;
  rut?: string;
  name?: string;
  code?: number;
  enabled?: boolean;
}
```

The two new fields are `code?: number` and `enabled?: boolean`. Field
order matches the delta spec table. No runtime code, no imports added.

### `src/app/model/doctor/doctor-create-resource.dto.ts` (modify)

Add `code?: number` to the existing class. The class keeps the
definite-assignment `!` style on the original two fields. The new field
is optional (`?`) — that is the contract the delta spec locks so the
legacy `doctor-form` consumer keeps compiling.

Final shape:

```ts
export class DoctorCreateResourceDto {
  rut!: string;
  name!: string;
  code?: number;
}
```

### `src/app/model/doctor/doctor-update-resource.dto.ts` (create)

New file. Strict typed class with the two fields the delta spec
mandates for the update payload. Mirror the existing `!-style` of
`DoctorCreateResourceDto`:

```ts
export class DoctorUpdateResourceDto {
  rut!: string;
  name!: string;
}
```

No `code` field (locked in the delta spec). No runtime code.

### `src/app/services/doctor.service.ts` (modify)

Add two methods after `createDoctor`. Preserve the `private host =
environment.hostRmFarma`, `HttpClient` injection, and singular
`${host}/doctor` path convention. The new methods:

```ts
public updateDoctor(
  id: string,
  doctor: DoctorUpdateResourceDto,
): Observable<DoctorResourceDto> {
  return this.http.put<DoctorResourceDto>(`${this.host}/doctor/${id}`, doctor);
}

public deleteDoctor(id: string): Observable<void | DoctorResourceDto> {
  return this.http.delete<void | DoctorResourceDto>(`${this.host}/doctor/${id}`);
}
```

Add the import for `DoctorUpdateResourceDto`. No other methods change.

### `src/app/services/doctor.service.spec.ts` (create)

`HttpClientTestingModule` + `HttpTestingController`. Assert all five
methods plus the delete error propagation. See [Test Plan](#6-test-plan-strict-tdd).
File location: next to the service, per the project convention.

### `src/app/pages/maintainer/doctor/doctor.component.ts` (create)

Standalone component, no NgRx. Imports follow the `schemas.component.ts`
shape: `ToastModule`, `ToolbarModule`, `ButtonDirective`, `Ripple`,
`TableModule`, `DialogModule`, `ReactiveFormsModule`, `FormsModule`,
`InputTextModule`, `NgForOf`, `NgIf`, `PrimeTemplate`, `TagModule`
(for the Estado badge), `FormControlStatusDirective`,
`FormValidationMessagesComponent`, `ModalErrorComponent`,
`ModalSuccessComponent`, `SpinnerComponent`, plus the new
`DoctorFormDialogComponent`. Class shape (public fields and method
signatures):

```ts
export class DoctorComponent implements OnInit {
  cols: ColumModelDto[] = [];
  doctorsList: DoctorResourceDto[] = [];
  loadingReport = false;
  displayCreateDialog = false;
  displayEditDialog = false;
  editingDoctor?: DoctorResourceDto;
  doctorCreateForm!: FormGroup;
  doctorEditForm!: FormGroup;
  displayOk = false;
  displayError = false;
  isLoadingUpdate = false;
  messageError = '';

  constructor(
    private readonly doctorService: DoctorService,
    private readonly fb: FormBuilder,
  ) {}

  ngOnInit(): void;
  initColumns(): void;
  initDataTable(): void;
  onGlobalFilter(dt: Table, event: Event): void;
  openCreateDialog(): void;
  openEditDialog(doctor: DoctorResourceDto): void;
  saveCreate(payload: DoctorCreateResourceDto): void;
  saveEdit(id: string, payload: DoctorUpdateResourceDto): void;
  confirmDelete(doctor: DoctorResourceDto): void;
  confirmDialog($event: boolean): void;
  confirmDialogError($event: boolean): void;
  cancelModal(): void;
}
```

The page holds two `FormGroup` fields (`doctorCreateForm`,
`doctorEditForm`) as the form state for the two dialogs. The forms are
built inside the dialog component, but the parent binds them via
template reference variables (or, equivalently, the dialog exposes
`form: FormGroup` and the parent reads it — see the dialog contract
below). Spec target: `doctor.component.spec.ts`.

### `src/app/pages/maintainer/doctor/doctor.component.html` (create)

Page chrome `card px-6 py-6`, `<p-toolbar>` with "Nuevo"
(`p-button-success`, `pi pi-plus`) on the left. `<p-table>` with the
locked attribute set (see the proposal table for the exact
`rowsPerPageOptions`, `currentPageReportTemplate`,
`globalFilterFields`, etc.). Body template is hand-written (see
[Decision: Hand-written actions column](#decision-hand-written-actions-column-not-cols-driven)):
four `<td>` from the `cols` loop, then a fifth `<td>` for the
Estado badge (`<p-tag [value]="row.enabled ? 'Activo' : 'Inactivo'"
[severity]="row.enabled ? 'success' : 'danger'">`), then a sixth `<td>`
with the pencil + trash buttons (`p-button-rounded p-button-warning
pi pi-pencil` and `p-button-rounded p-button-danger pi pi-trash`).
Two `<p-dialog>` blocks (create + edit), each rendering
`<app-doctor-form-dialog>` with the appropriate `[mode]`, `[doctor]`,
and `(save)` / `(cancel)` bindings. Tail: `<app-spinner
*ngIf="isLoadingUpdate">`, `<app-modal-success (confirm)="...">`,
`<app-modal-error (confirm)="...">`.

### `src/app/pages/maintainer/doctor/doctor.component.spec.ts` (create)

`TestBed` with the standalone `DoctorComponent` imported and a
`DoctorService` spy. `Swal.fire` mocked via direct reassignment.
See [Test Plan](#6-test-plan-strict-tdd) for the full scenario list.

### `src/app/pages/maintainer/doctor/doctor-form-dialog.component.ts` (create)

Standalone component. Imports: `ReactiveFormsModule`, `FormsModule`,
`InputTextModule`, `DialogModule`, `NgIf`, `FormControlStatusDirective`,
`FormValidationMessagesComponent`, `RutFormatterDirective`. Contract:

```ts
export type DoctorFormMode = 'create' | 'edit';

export class DoctorFormDialogComponent implements OnInit {
  @Input() mode: DoctorFormMode = 'create';
  @Input() doctor?: DoctorResourceDto;
  @Output() save = new EventEmitter<DoctorCreateResourceDto | DoctorUpdateResourceDto>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  dialogHeader: string;

  ngOnInit(): void;
  buildForm(): void;
  onSave(): void;     // emits (save) with the payload (omits code in edit mode)
  onCancel(): void;   // emits (cancel)
}
```

Form definition:

- `rut`: `['', [Validators.required, rutValidator()]]`
- `name`: `['', [Validators.required, Validators.maxLength(120)]]`
- `code`: `[null, [Validators.required,
  Validators.pattern(/^[1-9]\d{0,4}$/)]]` — the pattern matches
  `1`..`99999` (no leading zero, up to 5 digits). The control is
  **disabled** when `mode === 'edit'` and excluded from the emitted
  payload.

In `edit` mode `patchValue({ rut: doctor.rut, name: doctor.name })`.

### `src/app/pages/maintainer/doctor/doctor-form-dialog.component.html` (create)

`<p-dialog [(visible)]="display" [modal]="true" [style]="{width: '600px'}"
class="p-fluid" [header]="dialogHeader">` with `dialogHeader` bound
to `"Nuevo Doctor"` (create) or `"Editar Doctor"` (edit). Body:
`<form [formGroup]="form">` with three `field col-12` rows, each
holding a `<span class="p-float-label">` wrapping an `<input
pInputText>` (or `<input pInputText appRutFormatter>` for `rut`) and
a `<label>`, followed by `<app-form-validation-messages>`. Footer:
"Cancelar" (`p-button-text p-button-secondary`, calls `onCancel()`)
and "Guardar" (`p-button-text`, `[disabled]="form.invalid"`, calls
`onSave()`).

The dialog is uncontrolled by the parent in the sense that the parent
just opens/closes it; the form is built and reset internally. On
`mode === 'create'` and `mode === 'edit'` the form is built from
scratch in `ngOnInit` to keep the spec deterministic.

### `src/app/pages/maintainer/doctor/doctor-form-dialog.component.spec.ts` (create)

Standalone-only `TestBed`. See [Test Plan](#6-test-plan-strict-tdd)
for the scenario list.

### `src/app/pages/maintainer/maintainer.routes.ts` (modify)

Add one import line and one route entry. See
[Routing & Menu Wiring](#5-routing--menu-wiring).

### `src/assets/demo/data/menu-items.json` (modify)

Append one entry under "Administración" `items`. Preserve everything
else verbatim. See [Routing & Menu Wiring](#5-routing--menu-wiring)
for the exact JSON to add.

## Interfaces / Contracts

### DTOs

```ts
// doctor-resource.dto.ts
export class DoctorResourceDto {
  id?: string;
  rut?: string;
  name?: string;
  code?: number;
  enabled?: boolean;
}

// doctor-create-resource.dto.ts
export class DoctorCreateResourceDto {
  rut!: string;
  name!: string;
  code?: number;
}

// doctor-update-resource.dto.ts (NEW)
export class DoctorUpdateResourceDto {
  rut!: string;
  name!: string;
}
```

### Service

```ts
findAllDoctors(): Observable<DoctorResourceDto[]>;
findDoctorByRut(rut: string): Observable<DoctorResourceDto>;
createDoctor(dto: DoctorCreateResourceDto): Observable<DoctorResourceDto>;
updateDoctor(id: string, dto: DoctorUpdateResourceDto): Observable<DoctorResourceDto>;
deleteDoctor(id: string): Observable<void | DoctorResourceDto>;
```

All five methods preserved/implemented. `host = environment.hostRmFarma`.
Singular `/doctor` paths. `update` uses `PUT`; `delete` uses `DELETE`.

### Form dialog

```ts
@Input() mode: 'create' | 'edit';
@Input() doctor?: DoctorResourceDto;
@Output() save: EventEmitter<DoctorCreateResourceDto | DoctorUpdateResourceDto>;
@Output() cancel: EventEmitter<void>;
```

Form controls (create mode):

| Control | Validators |
| ------- | ---------- |
| `rut`   | `Validators.required`, `rutValidator()` |
| `name`  | `Validators.required`, `Validators.maxLength(120)` |
| `code`  | `Validators.required`, `Validators.pattern(/^[1-9]\d{0,4}$/)` |

Form controls (edit mode): `rut` + `name` only; `code` is not part of
the form (the field is omitted entirely from the template and the
`code` control is not added to the FormGroup). This keeps the emitted
payload shape exactly `{ rut, name }`.

### Routing

```ts
// maintainer.routes.ts
{ path: 'doctor', component: DoctorComponent }
```

### Menu

```json
{
  "label": "Doctores",
  "icon": "pi pi-fw pi-id-card",
  "routerLink": ["/main/maintainer/doctor"]
}
```

## Migration / Rollout

No data migration. No feature flags. Single PR per the
chained-PR budget (see below). The change is fully additive at the
DTO layer; the new page lives under a new route; the menu gets a
new entry. Rollback = revert the single PR.

## Delivery Strategy (Review Budget)

- **Decision needed before apply**: No (single PR is feasible; design
  does not exceed the 400-line review budget by itself).
- **Chained PRs recommended**: No (apply-phase tasks may still split
  the work; that is `sdd-tasks`' call).
- **400-line budget risk**: Low. Estimated diff footprint:
  - DTOs: ~10 lines added/changed.
  - Service: ~15 lines (methods + import + spec).
  - Page + dialog templates and TS: ~300-350 lines including two
    specs. Well under 400 lines if `sdd-tasks` ships a single batch.
  - Routes + menu: ~6 lines.
  - If implementation lands with both component specs and the service
    spec, the total touches ~500 lines; `sdd-tasks` MAY split
    "DTO+service+spec" into PR #1 and "page+dialog+specs" into PR #2.
    That is a per-batch judgement, not a design-time decision.

## Open Questions

None. All decisions in scope are locked. Follow-ups (NgRx removal,
`doctor-form` migration, reactivate flow, plural endpoint migration,
specialties/schedules) are explicitly out of scope per the proposal.
