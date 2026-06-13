# Delta for Doctor Store (Untouched Boundary)

Domain: `doctor-store-untouched` (explicit boundary marker — the
`doctor-store` NgRx slice is **not modified** by this change).

Status: there is no existing main spec under
`openspec/specs/doctor-store-untouched/`. This change introduces a sentinel
spec whose sole purpose is to call out the boundary between the new
service-only Doctores page and the legacy NgRx slice still consumed by
`add-patient-v2` and the deprecated `doctor-form.component.ts`.

## Purpose

The team is phasing NgRx out for new features (locked decision: service-only
for this change and all future features). However, the existing
`doctor-store` slice continues to back `add-patient-v2` and the deprecated
inline-create flow (`src/app/pages/maintainer/schemas/doctor-form.component.ts`).
This delta explicitly declares that boundary so future reviewers do not
expect store updates alongside the service.

## ADDED Requirements

### Requirement: Doctor Store Slice Is Not Modified

The `doctor-store` NgRx slice under `src/app/root-store/doctor-store/` MUST
NOT be modified by this change. Specifically, none of the following files
SHALL be edited as part of `doctores-crud`:

- `actions.ts`
- `state.ts`
- `reducer.ts`
- `selector.ts`
- `effects.ts`
- `index.ts`
- `doctor-store.module.ts`

The Doctores page (`src/app/pages/maintainer/doctor/`) MUST NOT import from
`src/app/root-store/doctor-store/`. The page's data flow MUST be local
component state + `DoctorService` only.

(Previously: the slice existed and was consumed by `add-patient-v2` and the
deprecated `doctor-form.component.ts`. This change adds nothing to it.)

#### Scenario: The slice files are unchanged after this change

- GIVEN the change `doctores-crud` is fully applied
- WHEN `git diff` is run against `src/app/root-store/doctor-store/`
- THEN no files inside that directory MUST appear in the diff

#### Scenario: The Doctores page does not import from the store

- GIVEN the Doctores page (`doctor.component.ts` and
  `doctor-form-dialog.component.ts`) is fully implemented
- WHEN the source files are searched for imports of `@ngrx/store`,
  `@ngrx/effects`, or any path under `src/app/root-store/doctor-store/`
- THEN no such imports MUST be present

### Requirement: Legacy Doctor Consumers Continue To Work

The two legacy consumers of the doctor DTO/service MUST keep working
at the runtime level. Additive DTO changes (new optional fields) MAY
require a defensive TypeScript cast at the consumer site to keep
`ng build` green; such casts MUST be limited to type-coercion only
(e.g. `x as T` or `x satisfies T`) and MUST NOT alter the runtime
value, ordering, or shape of the data flowing through the call site.
The two consumers in scope:

- `src/app/pages/maintainer/schemas/doctor-form.component.ts` (deprecated
  inline-create flow; not migrated in this change).
- Any component under `src/app/pages/add-patient-v2/` that calls
  `DoctorService.findDoctorByRut` / `findAllDoctors` / `createDoctor`.

`ng build` MUST pass after this change with both legacy consumers
intact. The DTO field `code?: number` (optional at the DTO level) is
deliberately additive: legacy forms that submit only `{ rut, name }`
continue to type-check. Any type-coercion cast that surfaces at a
call site as a consequence of an additive DTO change (for example,
`add-patient-v2.component.ts` gained a single `as DiagnosisPatientResourceDto`
cast on the `mapDiagnosisDataLoadingPatient` return value to satisfy
its declared return type after `code: number` was added to
`DoctorResourceDto`) is in scope of this requirement and preserves
the pre-change runtime behavior.

(Previously: these consumers already worked. This requirement codifies the
"no regression" boundary.)

#### Scenario: Legacy doctor-form continues to compile

- GIVEN `doctor-form.component.ts` builds `DoctorCreateResourceDto` from a
  2-field form (without `code`)
- WHEN `npm run build` runs after this change is applied
- THEN the build MUST pass without TypeScript errors related to the
  `DoctorCreateResourceDto` shape

#### Scenario: Add-patient-v2 calls to DoctorService still work

- GIVEN `add-patient-v2` calls `DoctorService.findDoctorByRut` and
  `createDoctor` with the existing signatures
- WHEN the change is fully applied
- THEN those call sites MUST compile and the existing patient-creation
  flow MUST continue to function
- AND any cast added at a call site is type-coercion only
  (e.g. `x as T`), with no runtime side-effects and identical
  observable behavior to the pre-change baseline
