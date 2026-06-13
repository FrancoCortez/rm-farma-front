# Tasks: Doctores CRUD

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~610 (range 580–640) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 = B0+1+2; PR 2 = B3; PR 3 = B4; PR 4 = B5 |
| Delivery strategy | ask-always |
| Chain strategy | stacked-to-main |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Work Units

| Unit | Goal | Likely PR |
|------|------|-----------|
| 1 | Bootstrap + DTOs + service+spec | PR 1 |
| 2 | Form dialog + spec | PR 2 |
| 3 | Page + spec | PR 3 |
| 4 | Route + menu | PR 4 |

2-PR split (B0+1+2+3 / B4+5) also valid; orchestrator re-decides with user. One Conventional Commit per task, tests with behaviour (see `work-unit-commits`).

---

## Phase 0: Bootstrap (B0 — ~30 lines)

- [x] 0.1 `npm install --save sweetalert2`; commit `chore(deps): add sweetalert2 direct dep`. (`package.json`)
- [x] 0.2 First `npm test -- --watch=false --browsers=ChromeHeadless`; fix any launcher/`CHROME_BIN` issue. `karma-chrome-launcher` already a devDep. Commit `chore(test): make first karma run green` if a code edit is needed. (0–25 lines)

**Verify**: `npm run build` + `npm test` green (1 placeholder spec).

## Phase 1: DTOs (B1 — ~15 lines)

- [x] 1.1 Add `code?: number`, `enabled?: boolean` to `doctor-resource.dto.ts`; commit `feat(dto): add code and enabled to doctor resource`.
- [x] 1.2 Add `code?: number` to `doctor-create-resource.dto.ts` (optional — legacy consumer must compile); commit `feat(dto): add optional code to doctor create resource`.
- [x] 1.3 Create `doctor-update-resource.dto.ts` with `{ rut!, name! }`; commit `feat(dto): add doctor update resource`.

**Verify**: `npm run build` green. No DTO spec — types not unit-tested in repo.

## Phase 2: Service + spec (B2 — ~80 lines)

- [x] 2.1 Add `updateDoctor` (PUT) and `deleteDoctor` (DELETE) to `doctor.service.ts`; commit `feat(doctor): add update and delete service methods`.
- [x] 2.2 Create `doctor.service.spec.ts` covering all 7 design-test-plan scenarios; commit `test(doctor): add service spec for all 5 methods`.

**Verify**: `npm test` green; 8 service-scenarios pass (the design's 7 + 1 "should be created" sanity).

## Phase 3: Form dialog + spec (B3 — ~180 lines)

- [x] 3.1 Create `doctor-form-dialog.component.ts` (standalone; per design §Interfaces — `code` omitted in edit mode); commit `feat(doctor): add form dialog component`.
- [x] 3.2 Create `doctor-form-dialog.component.html` (PrimeNG dialog + `appRutFormatter` + `app-form-validation-messages` + footer); commit `feat(doctor): add form dialog template`.
- [x] 3.3 Create `doctor-form-dialog.component.spec.ts` (all 11 design scenarios); commit `test(doctor): add form dialog spec`.

**Verify**: build + tests green; 13 dialog-scenarios pass (the design's 11 + 1 cancel + 1 "form invalid when empty").

## Phase 4: Page + spec (B4 — ~250 lines)

- [x] 4.1 Create `doctor.component.ts` (standalone, no NgRx; field+method set per design; `Swal` import); commit `feat(doctor): add doctores page component`.
- [x] 4.2 Create `doctor.component.html` (toolbar + `<p-table>` locked pagination + hand-written body: cols-loop + Estado tag + Acciones pencil/trash + 2 dialogs + modals/spinner); commit `feat(doctor): add doctores page template`.
- [x] 4.3 Spec verification: `doctor.component.spec.ts` was written in the prior session (UNTRACKED, 11 scenarios including the 9 design scenarios). The component now satisfies it — all 32 specs green under strict TDD. Commit `test(doctor): doctores page spec green` for the tasks.md checkbox + minor spec scaffolding fix (removed `ColumModelDto` from the dead-code `_refs` block; it is an interface, not a value, which caused TS2693).

**Verify**: build + tests green; 9 page-scenarios pass.

## Phase 5: Route + menu (B5 — ~10 lines)

- [x] 5.1 Add `import { DoctorComponent }` and `{ path: 'doctor', component: DoctorComponent }` to `maintainer.routes.ts`; commit `feat(doctor): register doctor child route`.
- [x] 5.2 Append Doctores entry under "Administración" in `menu-items.json`; commit `feat(doctor): add Doctores sidebar entry`.
- [x] 5.3 Final `npm run build` + `npm test`; manual smoke at `/main/maintainer/doctor`. **Both green.** Test run: 32/32 success. Build: exit 0 (pre-existing warnings only — bundle budget, CommonJS bailouts, lara-light-blue stylesheet).

**Verify**: build + tests green; sidebar shows "Doctores"; CRUD end-to-end.

---

## Risks (open at apply)

- **`CHROME_BIN` on runner** — surface + fix in B0, not deferred.
- **Chained-PR decision** — orchestrator asks user (`ask-always`); 4-PR is recommendation.
- **Legacy consumer boundary** — `doctor-store-untouched` spec covers no-regression; verified per batch.
- **Bundle budget** — small page, well under 500kb warn / 1mb error.
