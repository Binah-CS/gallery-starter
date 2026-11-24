# Architecture

The decisions here are the ones that are expensive to change. Each has an ADR in `docs/adr/` with the reasons.
`npm run check` enforces rules R1-R5 below.

## 1. Context
```
  Photographer ──HTTP/JSON──▶  Gallery API  ──▶  SQLite file (data/app.db)
  (any client)                 one Node process
```
Not yet in the system: clients (people who view galleries), photos, login, notifications. Specs 004-005 add some of them.

## 2. Components: a modular monolith in three layers (ADR-001)
```
            ┌──────────────────────────── src/app.ts (composition root: wires everything) ─┐
 request ──▶│ src/http      identity, routes, input shape, status codes, error contract      │
            │      │ calls                                                                   │
            │      ▼                                                                         │
            │ src/domain    rules: who may do what, which state changes are allowed          │
            │      ▲ implements the storage interface the domain declares                   │
            │      │                                                                         │
            │ src/data      SQL, schema, constraints, seed                                   │
            └────────────────────────────────────────────────────────────────────────────────┘
```

| Layer | Responsible for | Must not |
|---|---|---|
| `src/http` | Reading the request, resolving identity, checking input shape, choosing the status code, the error contract | Contain SQL or business rules; import `src/data` |
| `src/domain` | The rules: ownership, allowed state changes, what a valid gallery is | Know about HTTP or SQL |
| `src/data` | Storing and reading data; constraints that keep stored data valid | Decide who may do what |
| `src/app.ts` | Creating each part and connecting them | Contain logic |

## 3. Rules enforced by `npm run check`
| Rule | Says | Why (ADR) |
|---|---|---|
| R1 | SQL and `node:sqlite` appear only in `src/data` | One place to review every query for the owner filter (ADR-001, ADR-003) |
| R2 | `src/http` never imports `src/data` | Routes cannot bypass the rules in the domain (ADR-001) |
| R3 | `src/domain` imports neither Express nor `src/data` | Rules can be tested and changed without HTTP or a database (ADR-001) |
| R4 | Every route uses `requireUser` | No route is reachable without an identity (ADR-002) |
| R5 | No owner read from `req.body`, `req.query` or `req.params` | The owner always comes from identity (ADR-003) |

The check reads source text. It catches only what it looks for, so passing it is not proof the architecture is right. Human review still is.

## 4. Where state lives
| State | Lives in | Why not elsewhere |
|---|---|---|
| Galleries, photographers | SQLite | Must survive a restart; constraints are enforced there |
| Who is asking | The request (`X-User-Id`, assumption A-1), resolved per request | Server memory is lost on restart and not shared by a second process |
| Nothing else | | No in-memory caches or global variables holding data |

## 5. Synchronous now, asynchronous later
Every request does all its work before responding. Spec 005 (notify clients) is the first work that should not make the photographer wait. It will use a job table and a worker inside the same process, not a second service.

## 6. What changes with 100 times the users
| Pressure | First response | Not yet |
|---|---|---|
| Many galleries per photographer | Index on `owner_id` (exists), pagination on the list | Caching |
| Many simultaneous requests | Several copies of the same process behind a load balancer; possible because no state is in memory | Splitting into services |
| SQLite write contention | Move to a server database; only `src/data` changes (R1) | |

## 7. Decision records
| ADR | Decision |
|---|---|
| ADR-001 | Modular monolith in three layers, enforced by a check |
| ADR-002 | Identity is resolved once at the HTTP boundary; missing or unknown identity is 401 |
| ADR-003 | Ownership is enforced in the query; another owner's gallery is 404, not 403 |
