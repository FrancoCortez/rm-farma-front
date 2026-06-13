# OpenSpec SDD Conventions — rm-farma-front

> SDD workflow conventions for the `rm-farma-front` repo. The top-level
> `AGENTS.md` (project root) is authoritative for general repo conventions.
> This file is authoritative for the SDD artifact store (`openspec/`).

## Project context

- **Project**: `rm-farma-front` (Angular 17.3 standalone bootstrap, NgRx 17.2, PrimeNG 17.18, Karma+Jasmine).
- **Authoritative context**: `openspec/context/rm-farma-front.md`.
- **Authoritative spec/config**: `openspec/config.yaml` (testing, phase rules, strict TDD flag).

## Artifact layout

```
openspec/
├── AGENTS.md                  # this file (SDD conventions)
├── config.yaml                # context, rules, testing capabilities
├── context/
│   └── rm-farma-front.md      # detailed project context (stack, layout, conventions)
├── specs/                     # authoritative specs by domain
│   └── <domain>/spec.md
└── changes/                   # active changes (proposal → spec → design → tasks → apply → verify → archive)
    ├── <change-name>/
    │   ├── proposal.md
    │   ├── specs/             # delta specs
    │   ├── design.md
    │   └── tasks.md
    └── archive/               # completed/archived changes
```

## Workflow

1. **Explore** (`sdd-explore`) — clarify intent before writing artifacts.
2. **Propose** (`sdd-propose`) — write `openspec/changes/<change-name>/proposal.md` with intent, scope, and approach.
3. **Spec** (`sdd-spec`) — write delta specs under `openspec/changes/<change-name>/specs/`.
4. **Design** (`sdd-design`) — write `design.md` for the change.
5. **Tasks** (`sdd-tasks`) — break work into hierarchical, single-session tasks.
6. **Apply** (`sdd-apply`) — implement task by task, follow existing code patterns.
7. **Verify** (`sdd-verify`) — run tests, prove implementation matches spec/design/tasks.
8. **Archive** (`sdd-archive`) — sync delta specs into `openspec/specs/<domain>/`.

## Testing policy

- **Strict TDD Mode is ON** (Karma+Jasmine runner available; `tsconfig.spec.json` includes `src/**/*.spec.ts`).
- New behavior MUST land with specs (RED → GREEN → REFACTOR). Place `*.spec.ts` files next to the source they cover.
- **Verify command**: `npm test -- --watch=false --browsers=ChromeHeadless`.
- **Build command**: `npm run build`.
- **Coverage**: `ng test --code-coverage`; no percentage gate (threshold = 0).

## Stack-aware rules

- **Standalone components** for app code. NgRx registration stays via `RootStoreModule` + `*-store.module.ts` until a dedicated migration change decides otherwise — keep new features consistent with the current pattern.
- **NgRx slice cohesion**: actions / state / reducer / selectors / effects / module grouped per feature folder under `src/app/root-store/<feature>-store/`.
- **Strict TypeScript + strict Angular templates** are non-negotiable.
- **No ESLint** is configured; rely on `ng build` for static checks and Prettier defaults for formatting.
- **Do not** introduce yarn/pnpm, a new linter, or relax strict flags without an SDD change.

## Do not

- Do not modify the top-level `AGENTS.md` from the SDD workflow.
- Do not write SDD artifacts outside `openspec/`.
- Do not delete or replace the existing `openspec/config.yaml` — extend it when phase rules change.
- Do not run `sdd-explore` / `sdd-propose` / later phases from `sdd-init`; init is read-only with respect to phases.
