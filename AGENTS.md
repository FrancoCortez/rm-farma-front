# AGENTS.md — rm-farma-front

Conventions and operational guardrails for AI agents (and humans) working on this project.

## Stack Snapshot

- **Framework**: Angular 17.3 (standalone components, app.config.ts, app.routes.ts)
- **Language**: TypeScript 5.4, strict mode on (incl. `strictTemplates`, `strictInputAccessModifiers`)
- **State**: NgRx 17.2 (`@ngrx/store`, `@ngrx/effects`, `@ngrx/store-devtools`)
- **UI**: PrimeNG 17.18, PrimeFlex, PrimeIcons, FullCalendar 6, SweetAlert2
- **Build**: Angular CLI 17.3 (`@angular-devkit/build-angular:application` builder)
- **Package manager**: npm (uses `package-lock.json` — do not commit `yarn.lock` or `pnpm-lock.yaml`)
- **Output**: `dist/rm-farma-front`, `baseHref=/rm-farma/`, `deployUrl=/rm-farma/`

## Source Layout

```
src/
├── app/
│   ├── layout/        # Shared layout components (header, sidebar, shell)
│   ├── model/         # Domain types / interfaces
│   ├── pages/         # Route-level feature pages
│   ├── root-store/    # NgRx root state (actions, reducers, effects, selectors)
│   ├── services/      # Injectable services (HTTP, domain, utilities)
│   ├── utils/         # Pure helpers, pipes, formatters
│   ├── app.component.ts/html
│   ├── app.config.ts  # Application providers (standalone bootstrap)
│   └── app.routes.ts  # Top-level route table
├── environments/      # environment.ts / environment.prod.ts
├── assets/
├── styles.scss
├── index.html
└── main.ts
```

## Build / Run / Test

| Task | Command |
| --- | --- |
| Dev server | `npm start` (alias of `ng serve`) |
| Production build | `npm run build` (uses `/rm-farma/` base href) |
| Dev build | `npm run build:dev` |
| Watch build | `npm run watch` |
| Unit tests | `npm test` (Karma + Jasmine, watch mode) |
| CI-style tests | `npm test -- --watch=false --browsers=ChromeHeadless` |
| Coverage | `ng test --code-coverage` (karma-coverage) |

There is **no ESLint** configured. Use `ng build` for type checking; Prettier (defaults) for formatting.

## Conventions

- **Standalone components** only — no NgModules beyond what Angular CLI generates by default.
- Component selector prefix: `app` (see `angular.json` `prefix`).
- Strict TypeScript and strict Angular templates — do not relax without an SDD change.
- NgRx: keep slice folders cohesive (actions/reducer/selectors/effects grouped per feature).
- Formatting: 2-space indent, single quotes for `.ts`, UTF-8, final newline (see `.editorconfig`).
- Budgets: initial bundle warns at 500kb / errors at 1mb; component styles at 2kb / 4kb. Respect them.

## Testing Policy

- Test runner is **available** (Karma + Jasmine + karma-coverage) → **Strict TDD Mode is ON**.
- Spec files live next to source as `*.spec.ts` and are picked up via `tsconfig.spec.json`.
- When introducing or changing behavior, write/update the spec first (RED → GREEN → REFACTOR).
- There are **no specs in `src/`** today — coverage starts at 0. New work is expected to land with specs.
- E2E: not configured. Add Playwright/Cypress through an SDD change when needed.

## SDD Workflow

- Specs of record: `openspec/specs/{domain}/spec.md`
- Active changes: `openspec/changes/{change-name}/`
- Always create the change directory before writing artifacts; never overwrite blindly.
- See `openspec/config.yaml` for per-phase rules.

## Do Not

- Do not introduce a new package manager (no `yarn`/`pnpm`).
- Do not add a linter without an SDD change that justifies the choice.
- Do not relax strict TypeScript or strict Angular templates.
- Do not modify `dist/`, `node_modules/`, `.angular/cache/`, or `coverage/` outputs.
