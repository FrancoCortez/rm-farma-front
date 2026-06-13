# Delta for Doctor Resource

Domain: `doctor-resource` (Doctor data shape, validation, and UI binding).

Status: there is no existing main spec under `openspec/specs/doctor-resource/`
— this change introduces the domain from scratch. All requirements below are
`ADDED`. Future modifications to the Doctor resource must be expressed as
`MODIFIED Requirements` against the blocks introduced here.

## ADDED Requirements

### Requirement: Doctor Resource Representation

The `DoctorResourceDto` returned by the backend MUST expose five fields with
the following types and nullability:

| Field    | Type    | Optional | Notes                                                     |
| -------- | ------- | -------- | --------------------------------------------------------- |
| `id`     | string  | no       | Server-assigned identifier.                               |
| `rut`    | string  | no       | Chilean RUT, formatted `xx.xxx.xxx-x`.                   |
| `name`   | string  | no       | Full display name.                                        |
| `code`   | number  | no       | Numeric, integer; range 1..99999 (locked in this spec).    |
| `enabled`| boolean | no       | `true` = active, `false` = soft-deleted / inactive.       |

The Doctores page MUST render `enabled === true` as the badge "Activo" and
`enabled === false` as the badge "Inactivo". The page MUST NOT filter out
`enabled === false` rows: soft-delete semantics are owned by the backend and
the UI simply reflects whatever the backend returns.

(Previously: the legacy `DoctorResourceDto` had only `id`, `rut`, `name`.)

#### Scenario: Reading a doctor returns all five fields

- GIVEN the backend responds with `{ id: "d-1", rut: "11.111.111-1", name: "Dr. Pérez", code: 42, enabled: true }`
- WHEN the Doctores page receives the response from `findAllDoctors()`
- THEN the list row MUST expose `id = "d-1"`, `rut = "11.111.111-1"`, `name = "Dr. Pérez"`, `code = 42`, `enabled = true`

#### Scenario: Enabled badge reflects the `enabled` field

- GIVEN a row where `enabled === true`
- WHEN the Doctores page renders the Estado column for that row
- THEN it MUST display the badge "Activo"

- GIVEN a row where `enabled === false`
- WHEN the Doctores page renders the Estado column for that row
- THEN it MUST display the badge "Inactivo"

#### Scenario: Inactive doctors remain visible

- GIVEN the backend response includes a doctor with `enabled === false`
- WHEN `findAllDoctors()` resolves
- THEN the Doctores page MUST render that row in the table (no client-side filtering by `enabled`)

### Requirement: Doctor Code Uniqueness at UI Level

The Doctores page form control for `code` MUST apply the following validators
in composition with the default control state:

- `Validators.required` (this is the form-level enforcement; the DTO field stays optional so the deprecated `doctor-form.component.ts` consumer keeps compiling).
- A numeric, integer, and range 1..99999 validator (lower and upper bounds are locked in this spec).

If any of these checks fail, the form MUST be invalid and the save button
MUST be disabled. The page MUST surface the corresponding error via the
existing `FormValidationMessagesComponent` so the user sees why the value is
rejected.

The bound range 1..99999 is part of the contract: changing the bounds requires
a new SDD change. Outside this change, the DTO field `code` itself remains
`code?: number` (optional at the DTO level — see Risks in the proposal).

(Previously: no `code` field existed in the form or DTO; this requirement
introduces the field and locks its validation bounds.)

#### Scenario: Empty code is rejected

- GIVEN the create form is open with an empty `code` control
- WHEN the user does not type anything into the `code` field
- THEN the `code` control MUST be invalid with a `required` error
- AND the save button MUST be disabled

#### Scenario: Non-numeric code is rejected

- GIVEN the create form `code` control value is `"abc"`
- WHEN validation runs
- THEN the `code` control MUST be invalid
- AND the save button MUST be disabled

#### Scenario: Zero or negative code is rejected

- GIVEN the create form `code` control value is `0` or `-5`
- WHEN validation runs
- THEN the `code` control MUST be invalid
- AND the save button MUST be disabled

#### Scenario: Code above 99999 is rejected

- GIVEN the create form `code` control value is `100000` or any larger integer
- WHEN validation runs
- THEN the `code` control MUST be invalid
- AND the save button MUST be disabled

#### Scenario: Code in range 1..99999 is accepted

- GIVEN the create form `code` control value is `1`, `42`, or `99999`
- WHEN validation runs
- THEN the `code` control MUST be valid (assuming all other fields are valid)
- AND the save button MUST be enabled

### Requirement: Doctor RUT Validation

The Doctores page form MUST bind the `rut` control with `Validators.required`
and the existing `rutValidator()` from
`src/app/utils/form-validation/rut-validator.form.ts`. The RUT input MUST
display the `RutFormatterDirective` (`[appRutFormatter]`) so the value is
formatted as `xx.xxx.xxx-x` on every keystroke.

The form MUST surface validation errors via the existing
`FormValidationMessagesComponent`. The `rut` control MUST be invalid in
exactly two cases: empty (with a `required` error) or failing the RUT check
digit (with an `invalidRut` error).

(Previously: the legacy `doctor-form.component.ts` used a hand-rolled
validation; the Doctores page standardizes on the project-wide `rutValidator`
helper and formatter directive.)

#### Scenario: Empty RUT is rejected

- GIVEN the form is open with an empty `rut` control
- WHEN the user does not type anything into the RUT field
- THEN the `rut` control MUST be invalid with a `required` error
- AND the save button MUST be disabled

#### Scenario: RUT with an invalid check digit is rejected

- GIVEN the form `rut` control value is `"11.111.111-0"`
- WHEN validation runs
- THEN the `rut` control MUST be invalid with an `invalidRut` error
- AND the save button MUST be disabled

#### Scenario: RUT with a valid check digit is accepted

- GIVEN the form `rut` control value is `"11.111.111-1"`
- WHEN validation runs
- THEN the `rut` control MUST be valid
- AND the save button MUST be enabled (assuming the other fields are also valid)

#### Scenario: RUT input is formatted on every keystroke

- GIVEN the user types the digits `111111111` into the RUT input
- WHEN each keystroke fires
- THEN the input value displayed in the control MUST follow the `xx.xxx.xxx-x` pattern (e.g. `11.111.111` and then `11.111.111-1` once the check digit is entered)
