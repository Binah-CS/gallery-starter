# Spec 002: Create a gallery

Status: REVIEWED

## 1. Problem and scope
A photographer wants to create a new, empty gallery to fill later.
In scope: `POST /api/galleries`.
Out of scope: photos, publishing (spec 003), renaming, deleting, any user interface.

## 2. Human decisions
An agent must not re-decide these. If one seems wrong, stop and say so.

| # | Decision | Reason | Recorded in |
|---|---|---|---|
| D1 | The owner is the caller (`res.locals.userId`). The request cannot name an owner | Otherwise anyone can create galleries in someone else's name | ADR-003, constitution 5 |
| D2 | The only accepted field is `name`. Any other field (for example `ownerId`, `status`, `id`) is rejected with 400 | Ignoring unknown fields hides client mistakes and invites mass assignment | Constitution 4 |
| D3 | A new gallery is always `draft`, with `publishedAt` null | Publishing is a separate, deliberate action (spec 003) | |
| D4 | The name is trimmed. After trimming it must be 1-100 characters | "  Wedding " and "Wedding" are the same name to a person | |
| D5 | A name is unique per owner, exactly as written after trimming. Two photographers may use the same name | Two galleries called "Wedding" for one photographer cannot be told apart | Schema `UNIQUE (owner_id, name)` |
| D6 | A duplicate name is 409 `NAME_TAKEN`, detected by the database constraint, not by checking first | Check-then-insert lets two simultaneous requests both pass the check | |
| D7 | `createdAt` comes from the injected clock (`now`) | Tests must be deterministic | Constitution 4 |

## 3. Access patterns
| # | Who | Action | Read/Write | How often | Needs |
|---|---|---|---|---|---|
| AP-2 | Photographer | Creates a gallery | Write | A few times a week | Owner, name, unique per owner |

## 4. API contract
`POST /api/galleries` with header `X-User-Id` and JSON body `{ "name": "<string>" }`

| Case | Status | Body |
|---|---|---|
| Created | 201 | The new gallery: `{ "id", "name", "status": "draft", "createdAt", "publishedAt": null }` |
| Body is not a JSON object, `name` missing or not a string, name empty or longer than 100 after trimming, or any field other than `name` | 400 | `{ "error": "VALIDATION_FAILED" }` |
| Body is not valid JSON | 400 | `{ "error": "INVALID_JSON" }` (already handled by the error handler) |
| Same owner already has a gallery with this name | 409 | `{ "error": "NAME_TAKEN" }` |
| No identity / unknown identity | 401 | As in spec 001 |

## 5. Data
No schema change. The existing constraints already enforce D3 (default status), D4 (length) and D5 (uniqueness).
Map the SQLite unique-constraint failure to `NAME_TAKEN` in `src/data`; do not let it reach the client as a 500.

## 6. Acceptance criteria
AC-1: create
- Given dana owns 2 galleries
- When dana creates a gallery named "Rosen engagement"
- Then 201 with that gallery, status "draft", publishedAt null, createdAt equal to the injected clock
- And the database holds a 4th gallery, owned by dana, with that name

AC-2: the name is trimmed
- When dana creates a gallery named "  Rosen engagement  "
- Then 201 with name "Rosen engagement"
- And the stored name is "Rosen engagement"

AC-3: the owner cannot be chosen
- When dana sends `{ "name": "Spring", "ownerId": "noa" }`
- Then 400 `VALIDATION_FAILED`
- And no gallery is created, for dana or for noa

AC-4: status cannot be chosen
- When dana sends `{ "name": "Spring", "status": "published" }`
- Then 400 `VALIDATION_FAILED`
- And no gallery is created

AC-5: invalid names
- When dana sends each of: no `name`; `name` of 42; `name` of "   "; `name` of 101 characters; a body that is a JSON array
- Then each is 400 `VALIDATION_FAILED`
- And the number of galleries is unchanged
- (A name of exactly 100 characters is accepted.)

AC-6: duplicate name for the same owner
- Given dana owns "Levi wedding"
- When dana creates "Levi wedding"
- Then 409 `NAME_TAKEN`
- And dana still has exactly one gallery with that name

AC-7: the same name for a different owner
- Given dana owns "Levi wedding"
- When noa creates "Levi wedding"
- Then 201
- And both galleries exist, one per owner

AC-8: identity
- When a request has no X-User-Id, or an unknown one
- Then 401 as in spec 001
- And no gallery is created

## 7. Architecture notes
| Layer | Does |
|---|---|
| `src/http/galleries.routes.ts` | Adds `POST /api/galleries` with `requireUser`; checks the body's shape (object, only `name`, string); returns 201 |
| `src/domain/galleries.ts` | `create(ownerId, name)`: trims, checks length, sets status draft and `createdAt` from `now` |
| `src/data/galleries.repo.ts` | `insert(...)`: one INSERT; turns the unique-constraint error into `NAME_TAKEN` |
| `src/app.ts` | Passes `now` into the gallery service |

`npm run check` must pass.

## 8. Open questions
None. If you find one, stop and ask.
