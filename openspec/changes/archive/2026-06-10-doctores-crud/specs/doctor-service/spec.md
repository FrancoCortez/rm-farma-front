# Delta for Doctor Service

Domain: `doctor-service` (HTTP contract for the `DoctorService`).

Status: there is no existing main spec under `openspec/specs/doctor-service/`
— this change introduces the domain from scratch. All requirements below are
`ADDED`. Future modifications to the service contract must be expressed as
`MODIFIED Requirements` against the blocks introduced here.

## ADDED Requirements

### Requirement: Find All Doctors

`DoctorService.findAllDoctors()` MUST issue an HTTP `GET` request to
`${host}/doctor`, where `host` resolves from `environment.hostRmFarma`. The
service MUST return an `Observable<DoctorResourceDto[]>`. The array MAY be
empty; an empty backend response MUST resolve to an empty array on the
client.

(Previously: `findAllDoctors()` existed but was not part of the formal
contract; this requirement codifies verb, URL, and shape.)

#### Scenario: Successful find-all returns the array of doctors

- GIVEN the backend responds to `GET ${host}/doctor` with HTTP 200 and body `[{ id: "d-1", rut: "11.111.111-1", name: "Dr. Pérez", code: 42, enabled: true }]`
- WHEN `findAllDoctors()` is subscribed
- THEN it MUST emit one value: the array of `DoctorResourceDto` received from the backend
- AND it MUST complete without error

#### Scenario: Empty backend response returns an empty array

- GIVEN the backend responds to `GET ${host}/doctor` with HTTP 200 and body `[]`
- WHEN `findAllDoctors()` is subscribed
- THEN it MUST emit `[]`
- AND it MUST complete without error

### Requirement: Find Doctor by RUT

`DoctorService.findDoctorByRut(rut: string)` MUST issue an HTTP `GET` request
to `${host}/doctor/find-by-rut/${rut}` and return
`Observable<DoctorResourceDto>`. The `rut` value MUST be passed verbatim in
the URL path; encoding of any non-alphanumeric characters is the caller's
responsibility.

#### Scenario: Successful find-by-rut returns a single doctor

- GIVEN the backend responds to `GET ${host}/doctor/find-by-rut/11.111.111-1` with HTTP 200 and body `{ id: "d-1", rut: "11.111.111-1", name: "Dr. Pérez", code: 42, enabled: true }`
- WHEN `findDoctorByRut("11.111.111-1")` is subscribed
- THEN it MUST emit exactly one value: the `DoctorResourceDto` received from the backend

### Requirement: Create Doctor

`DoctorService.createDoctor(dto: DoctorCreateResourceDto)` MUST issue an
HTTP `POST` request to `${host}/doctor` with `dto` as the JSON request body.
It MUST return `Observable<DoctorResourceDto>`. The emitted DTO MUST be the
backend's response — i.e. the doctor with backend-assigned `id` and an
`enabled` field set by the backend (typically `true` on create).

#### Scenario: Create returns the backend-assigned DTO

- GIVEN the backend responds to `POST ${host}/doctor` with HTTP 201 and body `{ id: "d-7", rut: "11.111.111-1", name: "Dr. Pérez", code: 42, enabled: true }`
- WHEN `createDoctor({ rut: "11.111.111-1", name: "Dr. Pérez", code: 42 })` is subscribed
- THEN it MUST emit exactly one value: the `DoctorResourceDto` returned by the backend
- AND the request body MUST equal `{ rut: "11.111.111-1", name: "Dr. Pérez", code: 42 }`

### Requirement: Update Doctor

`DoctorService.updateDoctor(id: string, dto: DoctorUpdateResourceDto)` MUST
issue an HTTP `PUT` request to `${host}/doctor/${id}` with `dto` as the JSON
request body. It MUST return `Observable<DoctorResourceDto>`. The
`DoctorUpdateResourceDto` shape is exactly `{ rut: string; name: string }` —
the `code` field MUST NOT appear in the update payload.

(Previously: this method did not exist; this is the new behavior added in
this change.)

#### Scenario: Successful update returns the updated DTO

- GIVEN the backend responds to `PUT ${host}/doctor/d-1` with HTTP 200 and body `{ id: "d-1", rut: "22.222.222-2", name: "Dr. Pérez", code: 42, enabled: true }`
- WHEN `updateDoctor("d-1", { rut: "22.222.222-2", name: "Dr. Pérez" })` is subscribed
- THEN it MUST emit exactly one value: the `DoctorResourceDto` returned by the backend
- AND the request body MUST equal `{ rut: "22.222.222-2", name: "Dr. Pérez" }` (no `code`)

#### Scenario: Update payload must not include `code`

- GIVEN a call to `updateDoctor("d-1", { rut: "22.222.222-2", name: "Dr. Pérez" })`
- WHEN the HTTP request is issued
- THEN the request body MUST NOT contain a `code` field

### Requirement: Delete Doctor

`DoctorService.deleteDoctor(id: string)` MUST issue an HTTP `DELETE` request
to `${host}/doctor/${id}`. The method MUST return
`Observable<void | DoctorResourceDto>` — the return type is intentionally
permissive: the backend MAY respond with an empty body (resolves to `void`)
or with the soft-deleted DTO. The page MUST work with either shape.

On HTTP 4xx or 5xx, the request MUST propagate as an error on the observable
stream so the UI can surface it through `app-modal-error`.

(Previously: this method did not exist; this is the new behavior added in
this change.)

#### Scenario: Successful delete resolves (with or without body)

- GIVEN the backend responds to `DELETE ${host}/doctor/d-1` with HTTP 200 (or 204) and either an empty body or the soft-deleted DTO
- WHEN `deleteDoctor("d-1")` is subscribed
- THEN it MUST complete without error
- AND the emitted value MUST be either `void` (empty body) or a `DoctorResourceDto` (body present)

#### Scenario: HTTP error propagates to the observable

- GIVEN the backend responds to `DELETE ${host}/doctor/d-1` with HTTP 500 and an error body
- WHEN `deleteDoctor("d-1")` is subscribed
- THEN the observable MUST error with the HTTP error
- AND the error MUST NOT be swallowed by the service
