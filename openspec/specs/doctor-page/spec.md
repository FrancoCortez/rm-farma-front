# Doctores Page Spec

Domain: `doctor-page` (the Mantenedores Doctores list page, create/edit
dialog, delete confirmation, route registration, and sidebar menu entry).

Status: introduced by `doctores-crud` change (commit `feat/doctores-crud`).
All requirements below are `ADDED`. Future modifications to the page must be
expressed as `MODIFIED Requirements` against the blocks introduced here.

## ADDED Requirements

### Requirement: Doctores Page Lists All Doctors

On `ngOnInit`, the Doctores page MUST call `DoctorService.findAllDoctors()`
and render the response in a PrimeNG `p-table`. The table MUST display
exactly five columns, in this order: RUT, Nombre, Código, Estado, Acciones.

- The table MUST be paginated with `rows = 30` and
  `rowsPerPageOptions = [10, 20, 30, 40, 50]`.
- The paginator MUST use
  `currentPageReportTemplate = "Mostrando {first} a {last} de {totalRecords} Doctores"`.
- The Estado column MUST render a badge with the text "Activo" when
  `enabled === true` and "Inactivo" when `enabled === false`.
- The Acciones column MUST render a pencil button (edit) and a trash button
  (delete) per row, regardless of `enabled` value.

#### Scenario: Table renders the five columns

- GIVEN the Doctores page has loaded
- WHEN the user views the table
- THEN it MUST show columns labelled RUT, Nombre, Código, Estado, Acciones (in this order)

#### Scenario: Pagination matches the locked configuration

- GIVEN the Doctores page is rendered
- WHEN the user inspects the paginator
- THEN the default page size MUST be 30
- AND the page size options MUST be `[10, 20, 30, 40, 50]`
- AND the current-page report MUST follow the template `Mostrando {first} a {last} de {totalRecords} Doctores`

#### Scenario: Estado badge reflects the `enabled` field

- GIVEN the table contains a row with `enabled === true`
- WHEN the Estado column for that row is rendered
- THEN it MUST display the text "Activo"

- GIVEN the table contains a row with `enabled === false`
- WHEN the Estado column for that row is rendered
- THEN it MUST display the text "Inactivo"

#### Scenario: Acciones column shows edit and delete buttons

- GIVEN the table is rendered with at least one doctor row
- WHEN the user inspects the Acciones column
- THEN it MUST show a pencil button (edit) and a trash button (delete) for each row

### Requirement: Create Doctor Flow

The Doctores page MUST expose a "Nuevo" button in the page toolbar. Clicking
it MUST open a create dialog with three fields: RUT, Nombre, Código. The
dialog MUST start with a form in a pristine, untouched, valid-shape state
(all three controls present, no value).

The save button in the dialog MUST be disabled while the form is invalid
(`[disabled]="form.invalid"`). When the user submits a valid form, the page
MUST call `DoctorService.createDoctor({ rut, name, code })`, close the
dialog, display the success modal (`app-modal-success`), and on the
modal's `(confirm)` event re-run `findAllDoctors()` to refresh the table.

On HTTP errors:

- HTTP 4xx → the page MUST display `app-modal-error` with the backend's
  `err.error.errors` text (or a fallback Spanish message when the field is
  absent).
- HTTP 5xx or any other failure → the page MUST display `app-modal-error`
  with a generic Spanish message.

#### Scenario: Dialog opens with an empty, valid-shape form

- GIVEN the user clicks the toolbar "Nuevo" button
- WHEN the create dialog opens
- THEN the form MUST have three controls: `rut`, `name`, `code`
- AND all three controls MUST be `pristine` and `untouched`
- AND the save button MUST be disabled (form is invalid because all required fields are empty)

#### Scenario: Submitting a valid form creates a doctor and refreshes the list

- GIVEN the create dialog is open with `rut = "11.111.111-1"`, `name = "Dr. Pérez"`, `code = 42`
- WHEN the user clicks the save button
- THEN the page MUST call `createDoctor({ rut: "11.111.111-1", name: "Dr. Pérez", code: 42 })`
- AND the dialog MUST close
- AND `app-modal-success` MUST be displayed
- AND when the user confirms the success modal, the page MUST call `findAllDoctors()` again

#### Scenario: HTTP 4xx surfaces the backend error message

- GIVEN the create dialog is open with a valid form
- WHEN the user submits and `createDoctor` rejects with HTTP 400 and `err.error.errors = ["Ya existe un doctor con ese RUT"]`
- THEN the page MUST display `app-modal-error` whose text contains `err.error.errors[0]`

#### Scenario: HTTP 5xx surfaces a generic error message

- GIVEN the create dialog is open with a valid form
- WHEN the user submits and `createDoctor` rejects with HTTP 500 (or any other non-4xx error)
- THEN the page MUST display `app-modal-error` with a generic Spanish error message (not `err.error.errors`)

### Requirement: Edit Doctor Flow

The Doctores page MUST open the edit dialog when the user clicks the pencil
button on any row. The dialog MUST be pre-filled with the selected doctor's
`rut` and `name`. The `code` field MUST NOT be present in the edit form
(`DoctorUpdateResourceDto` does not include `code`).

When the user submits a valid edit form, the page MUST call
`DoctorService.updateDoctor(id, { rut, name })` where `id` is the row's
`id`. On success the dialog MUST close, `app-modal-success` MUST be
displayed, and on the modal's `(confirm)` event the page MUST re-run
`findAllDoctors()`.

Error handling for the edit flow MUST follow the same rules as the create
flow (4xx → `err.error.errors`; 5xx / other → generic Spanish message).

#### Scenario: Edit dialog is pre-populated with rut and name

- GIVEN a row with `id = "d-1"`, `rut = "11.111.111-1"`, `name = "Dr. Pérez"`, `code = 42`
- WHEN the user clicks the pencil button on that row
- THEN the edit dialog MUST open
- AND the form controls MUST be initialized with `rut = "11.111.111-1"` and `name = "Dr. Pérez"`
- AND the form MUST NOT contain a `code` control

#### Scenario: Submitting a valid edit updates the doctor and refreshes the list

- GIVEN the edit dialog is open with `id = "d-1"` and form values `rut = "22.222.222-2"`, `name = "Dr. Pérez (Updated)"`
- WHEN the user clicks the save button
- THEN the page MUST call `updateDoctor("d-1", { rut: "22.222.222-2", name: "Dr. Pérez (Updated)" })`
- AND the request body MUST NOT include a `code` field
- AND the dialog MUST close
- AND `app-modal-success` MUST be displayed
- AND when the user confirms the success modal, the page MUST call `findAllDoctors()` again

#### Scenario: Edit errors follow the same rules as create

- GIVEN the edit dialog is open with a valid form
- WHEN the user submits and `updateDoctor` rejects with HTTP 4xx (or 5xx)
- THEN the page MUST display `app-modal-error` following the same rules as the create flow

### Requirement: Delete Doctor Flow

The Doctores page MUST open a SweetAlert2 confirmation when the user clicks
the trash button on any row. The confirmation MUST use the title
"¿Eliminar Doctor?" and the body `¿Está seguro que desea eliminar a ${name}?`
where `${name}` is the selected doctor's `name`. The dialog MUST show
`icon: 'warning'`, `showCancelButton: true`, `confirmButtonText:
'Sí, eliminar'`, and `cancelButtonText: 'Cancelar'`.

- If the user cancels, the page MUST NOT call any service method.
- If the user confirms, the page MUST call
  `DoctorService.deleteDoctor(id)` where `id` is the row's `id`.
- On success the page MUST display `app-modal-success` and re-run
  `findAllDoctors()`.
- On HTTP error the page MUST follow the same rules as create (4xx →
  `err.error.errors`; 5xx / other → generic Spanish message).

#### Scenario: Cancel does not call the service

- GIVEN a row with `id = "d-1"` and `name = "Dr. Pérez"`
- WHEN the user clicks the trash button and then clicks "Cancelar" in the confirmation
- THEN the page MUST NOT call `deleteDoctor` (or any other doctor service method)
- AND the table state MUST remain unchanged

#### Scenario: Confirm deletes the doctor and refreshes the list

- GIVEN a row with `id = "d-1"` and `name = "Dr. Pérez"`
- WHEN the user clicks the trash button
- THEN the confirmation MUST show title "¿Eliminar Doctor?" and body "¿Está seguro que desea eliminar a Dr. Pérez?"

- GIVEN the confirmation is open
- WHEN the user clicks "Sí, eliminar"
- THEN the page MUST call `deleteDoctor("d-1")`
- AND on success `app-modal-success` MUST be displayed
- AND the page MUST call `findAllDoctors()` again

#### Scenario: Delete errors follow the same rules as create

- GIVEN a row with `id = "d-1"`
- WHEN the user clicks the trash button, then "Sí, eliminar", and `deleteDoctor` rejects with HTTP 4xx (or 5xx)
- THEN the page MUST display `app-modal-error` following the same rules as the create flow

### Requirement: Doctores Menu Entry

The Doctores page MUST be reachable from the sidebar under the
"Administración" section via a menu entry labelled "Doctores" (plural,
visible). The menu entry MUST set `routerLink: ["/main/maintainer/doctor"]`
so clicking it navigates to the Doctores page.

#### Scenario: Menu item is rendered with the label "Doctores"

- GIVEN the sidebar is open
- WHEN the user expands the "Administración" section
- THEN a menu entry labelled "Doctores" MUST be visible

#### Scenario: Menu item navigates to the Doctores page

- GIVEN the user is on any page in the app
- WHEN the user clicks the "Doctores" entry in the sidebar
- THEN the browser MUST navigate to `/main/maintainer/doctor`
- AND the Doctores page MUST be rendered

### Requirement: Doctores Route Registration

`maintainer.routes.ts` MUST register the Doctores page as a child route
named `doctor` (singular, matches the other children in the file: `schemas`,
`pa`, `commercial-product`). The route MUST use a direct `component:` import
(matching the existing children); it MUST NOT use `loadChildren`.

#### Scenario: The path is `doctor` (singular)

- GIVEN `maintainer.routes.ts` is loaded
- WHEN the router is asked for the Doctores child
- THEN its `path` MUST equal `'doctor'`

#### Scenario: The component is loaded directly

- GIVEN `maintainer.routes.ts` is loaded
- WHEN the router is asked for the Doctores child
- THEN it MUST declare a `component` property pointing to the Doctores page component
- AND it MUST NOT use `loadChildren`