# Spec 001: List my galleries

Status: IMPLEMENTED (checkpoint s5-start)

## 1. Problem and scope
A photographer wants to see her galleries.
In scope: `GET /api/galleries`.
Out of scope: creating, editing, publishing, photos, clients, login, any user interface.

## 2. Human decisions
| # | Decision | Reason | Recorded in |
|---|---|---|---|
| D1 | A photographer sees only galleries she owns | Brief: "she does not want anyone else touching her galleries" | ADR-003 |
| D2 | No identity: 401 `IDENTITY_MISSING`. Unknown identity: 401 `IDENTITY_UNKNOWN` | Fail loudly; an empty list would hide the mistake | ADR-002 |
| D3 | The owner filter is in the SQL query | A query cannot return what it does not select | ADR-003 |
| D4 | The response never includes the owner | It is always the caller; returning it invites clients to send it back | |

## 3. Access patterns
| # | Who | Action | Read/Write | How often | Needs |
|---|---|---|---|---|---|
| AP-1 | Photographer | Lists her galleries | Read | Every visit | Galleries by owner (index on `owner_id`) |

## 4. API contract
`GET /api/galleries` with header `X-User-Id: <photographer id>` (assumption A-1)

| Case | Status | Body |
|---|---|---|
| Success | 200 | `[{ "id", "name", "status", "createdAt", "publishedAt" }]`, oldest first |
| No identity | 401 | `{ "error": "IDENTITY_MISSING" }` |
| Unknown identity | 401 | `{ "error": "IDENTITY_UNKNOWN" }` |

## 5. Data
Tables `photographers (id, display_name)` and `galleries (id, owner_id, name, status, created_at, published_at)`.
Schema constraints: owner required and must exist (foreign key); status is `draft` or `published`;
name 1-100 characters; a name is unique per owner; `published_at` is set if and only if status is `published`.
Seed, once, when empty: photographers dana and noa; galleries "Levi wedding" (dana, draft),
"Cohen bar mitzvah" (dana, published), "Tel Aviv portraits" (noa, draft).

## 6. Acceptance criteria
AC-1: response shape
- Given noa owns one draft gallery
- When noa requests the list
- Then 200 with exactly that gallery, with fields id, name, status, createdAt, publishedAt and no owner field

AC-2: only my galleries
- Given dana owns 2 galleries and noa owns 1
- When dana requests the list
- Then 200 with exactly dana's 2 galleries
- And the stored galleries are unchanged

AC-3: no identity
- Given galleries exist
- When a request arrives with no X-User-Id
- Then 401 `IDENTITY_MISSING` and no gallery data

AC-4: unknown identity
- Given no photographer "rina" exists
- When rina requests the list
- Then 401 `IDENTITY_UNKNOWN`
- And no photographer is created

AC-5: data survives a restart
- Given the server has run once
- When it stops and starts again and dana requests the list
- Then dana's same 2 galleries are returned
- And the database holds 3 galleries in total (seeded once, not again)

## 7. Architecture notes
Identity: `src/http/identity.ts`. Route: `src/http/galleries.routes.ts`.
Rule: `src/domain/galleries.ts`. Query: `src/data/galleries.repo.ts`.

## 8. Open questions
None.
