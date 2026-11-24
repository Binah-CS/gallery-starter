# Spec 004: Log in (replaces assumption A-1)

Status: DRAFT (to be reviewed in session 6; do not implement)

## 1. Problem and scope
Today anyone can claim to be any photographer by sending `X-User-Id`. Photographers must prove who they are.
In scope: log in, log out, and identifying the photographer on every request from a session.
Out of scope: sign-up, password reset, clients logging in, any user interface.

## 2. Human decisions (proposed, to be confirmed in session 6)
| # | Proposed decision | Reason |
|---|---|---|
| D1 | Passwords are hashed with `scrypt` from `node:crypto`, with a per-user salt; never stored or logged in plain text | A vetted algorithm from the standard library; no new dependency |
| D2 | Logging in creates a server-side session: a random token in an `HttpOnly`, `SameSite=Strict` cookie; the database stores only a hash of the token | A stolen database does not give working sessions |
| D3 | Sessions expire 8 hours after login | A forgotten lab machine stops being logged in |
| D4 | A wrong password and an unknown photographer get the same answer: 401 `LOGIN_FAILED` | Do not reveal which photographer ids exist |
| D5 | `requireUser` reads the session instead of `X-User-Id`. No route changes | ADR-002 |
| D6 | The `X-User-Id` header stops working entirely | A leftover back door is worse than none |

## 3. API contract (proposed)
- `POST /api/session` `{ "photographerId", "password" }` -> 204 and a session cookie, or 401 `LOGIN_FAILED`
- `DELETE /api/session` -> 204; the session no longer works
- Every other route: 401 `IDENTITY_MISSING` without a valid session

## 4. Data (proposed)
- `photographers` gains `password_hash` and `password_salt`. Seed passwords are documented in `docs/seed-users.md`.
- New table `sessions (token_hash, photographer_id, expires_at)`.

## 5. Acceptance criteria
To be written in session 6.

## 6. Open questions
- Q1: How many failed logins before a delay or lockout?
- Q2: Do the tests log in through the API, or create sessions directly?
- Q3: What happens to sessions when a password changes? (No password change yet.)
