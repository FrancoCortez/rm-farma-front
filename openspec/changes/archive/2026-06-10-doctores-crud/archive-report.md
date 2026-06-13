# Archive Report: doctores-crud

**Change**: `doctores-crud`
**Branch**: `feat/doctores-crud`
**Archived**: 2026-06-10
**Archived by**: sdd-archive (openspec mode)
**Source of truth updated**: `openspec/specs/{doctor-resource,doctor-service,doctor-page,doctor-store-untouched}/spec.md`

---

## Summary

The `doctores-crud` SDD cycle completed successfully. All 4 delta specs
were synced into `openspec/specs/` as brand-new authoritative domain specs
(no existing specs to merge — all four domains were introduced by this change).

## Specs Synced

| Domain | Action | Details |
|--------|--------|---------|
| `doctor-resource` | Created | 3 requirements, 13 scenarios (DoctorResourceDto with code/enabled, code validation 1..99999, RUT validation) |
| `doctor-service` | Created | 5 requirements, 8 scenarios (findAllDoctors, findByRut, create, update, delete HTTP contract) |
| `doctor-page` | Created | 6 requirements, 18 scenarios (list page, create flow, edit flow, delete flow, menu entry, route registration) |
| `doctor-store-untouched` | Created | 2 requirements, 4 scenarios (NgRx boundary, legacy consumer no-regression — includes amended wording for type-coercion casts at call sites) |

## Verification

- **Tests**: 32/32 pass (`npm test -- --watch=false --browsers=ChromeHeadless`, 0.241s)
- **Build**: exit 0 (`npm run build`)
- **CRITICAL issues**: none
- **Warnings**: 3 (WARNING-1 spec wording drift on `doctor-store-untouched` — addressed by amended spec wording; WARNING-2 sweetalert2 CommonJS bailout — documented and expected; WARNING-3 cosmetic DebugElement import — SUGGESTION)
- **Triangulation gaps**: 4 SUGGESTION-level test quality notes (not spec violations)
- **Deviations**: 3 user-approved deviations acknowledged in verify-report (inline modals, id widened, dead-code cleanup)

## Archive Contents

The change folder (now at `openspec/changes/archive/2026-06-10-doctores-crud/`) contains:
- `proposal.md` ✅
- `specs/` ✅ (4 delta specs)
- `design.md` ✅
- `tasks.md` ✅ (11/11 tasks checked)
- `apply-progress.md` ✅
- `verify-report.md` ✅

## Key Deviations Documented

1. Inline `<p-dialog>` for success/error modals instead of shared `<app-modal-*>` (state machine preserved)
2. `id: string` widened to `id: string | undefined` in `updateDoctor`/`deleteDoctor`
3. `ColumModelDto` removed from `_refs` array; `DebugElement` still imported (cosmetic)

## Key Outcome

The Doctores CRUD page is live on `feat/doctores-crud` with:
- Full CRUD (create, read, update, soft-delete) via `DoctorService` (no NgRx)
- 32 unit specs green, production build exits 0
- `doctor-store` NgRx slice untouched, legacy `add-patient-v2` and `doctor-form` consumers still compile
- Route registered at `doctor` (singular), menu entry "Doctores" under "Administración"

## SDD Cycle Complete

The change has been fully planned, implemented, verified, and archived.
Ready for the next change.