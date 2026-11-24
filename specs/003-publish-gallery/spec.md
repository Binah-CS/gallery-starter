# Spec 003: Publish a gallery

Status: REVIEWED

## 1. Problem and scope
When a gallery is ready, the photographer publishes it so that her clients can see it.
In scope: `POST /api/galleries/:id/publish`.
Out of scope: telling clients (spec 005), unpublishing, requiring photos before publishing (there are no photos yet), any user interface.

## 2. Human decisions
| # | Decision | Reason | Recorded in |
|---|---|---|---|
| D1 | Publishing someone else's gallery is 404 `GALLERY_NOT_FOUND`, exactly like a gallery that does not exist | Do not reveal which galleries exist | ADR-003 |
| D2 | Publishing an already published gallery is 200 and changes nothing: `publishedAt` keeps its first value | A double click or a retry must be harmless (idempotent) | |
| D3 | The change is one conditional UPDATE that includes the owner and the current status in its WHERE clause. No read-then-write | Two simultaneous publishes, or a publish racing another change, cannot both apply | |
| D4 | `status` and `publishedAt` change together or not at all | The schema rule "published if and only if publishedAt is set" must never be broken | Schema CHECK |
| D5 | `publishedAt` comes from the injected clock | Deterministic tests | Constitution 4 |
| D6 | An id that is not a positive integer is 404 `GALLERY_NOT_FOUND` | To the caller it is simply not a gallery they can reach | |

## 3. Access patterns
| # | Who | Action | Read/Write | How often | Needs |
|---|---|---|---|---|---|
| AP-3 | Photographer | Publishes a gallery | Write | A few times a week | Gallery by id AND owner, current status |

## 4. API contract
`POST /api/galleries/:id/publish` with header `X-User-Id`, no body.

| Case | Status | Body |
|---|---|---|
| Published now | 200 | The gallery, status "published", publishedAt set |
| Was already published | 200 | The gallery, unchanged |
| Not found, not hers, or id not a positive integer | 404 | `{ "error": "GALLERY_NOT_FOUND" }` |
| No identity / unknown identity | 401 | As in spec 001 |

## 5. Data
No schema change.

## 6. Acceptance criteria
AC-1: publish a draft
- Given dana's gallery 1 is a draft
- When dana publishes gallery 1
- Then 200 with status "published" and publishedAt equal to the injected clock
- And the stored row has the same status and published_at, and no other gallery changed

AC-2: another owner's gallery
- Given gallery 3 belongs to noa and is a draft
- When dana publishes gallery 3
- Then 404 `GALLERY_NOT_FOUND`
- And gallery 3 is still a draft with published_at null

AC-3: already published
- Given dana's gallery 2 was published at 2026-11-03T18:30:00.000Z
- When dana publishes gallery 2
- Then 200 with publishedAt still 2026-11-03T18:30:00.000Z
- And the stored row is unchanged

AC-4: publishing twice in a row
- Given dana's gallery 1 is a draft
- When dana publishes gallery 1, and then publishes it again
- Then both responses are 200 with the same publishedAt
- And the stored published_at is that value

AC-5: ids that do not reach a gallery
- When dana publishes gallery 999, and gallery "abc"
- Then each is 404 `GALLERY_NOT_FOUND`
- And no gallery changed

AC-6: identity
- When a publish request has no identity, or an unknown one
- Then 401 as in spec 001
- And no gallery changed

## 7. Architecture notes
| Layer | Does |
|---|---|
| `src/http/galleries.routes.ts` | Adds the route with `requireUser`; parses the id |
| `src/domain/galleries.ts` | `publish(ownerId, id)`: decides the result from what the data layer reports |
| `src/data/galleries.repo.ts` | `publishOwned(id, ownerId, publishedAt)`: `UPDATE ... SET status='published', published_at=? WHERE id=? AND owner_id=? AND status='draft'`, then reads the row back by id AND owner |

Review focus: there must be no SELECT-then-UPDATE on the status, and every statement must include the owner.

## 8. Open questions
- Q1: Should a gallery need at least one photo before it can be published? Deferred until photos exist.
