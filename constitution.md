# Constitution

Rules for every feature. They bind both the human and the agent.
If a rule blocks you, raise it. Do not silently bend it.

## 1. Process
1. Implement only from a spec in `specs/` with status `REVIEWED`.
2. Tests first: write one test per acceptance criterion, run them, show that they fail. Then implement.
3. A test checks the response AND the resulting stored state that its criterion names.
4. Never claim tests pass without running them and showing the output.
5. When the spec is silent or ambiguous, stop and ask, or state the assumption in plain words. Never guess silently.
6. Do not change a test to make it pass. If a test is wrong, say so and explain why.
7. Nothing is accepted until the person who ran the agent can explain every function it wrote.

## 2. Fixed stack
- Node.js 22.13 or newer, TypeScript run with `tsx`, ES modules.
- One process on port 3000 serving a JSON API under `/api/*`. HTTP framework: Express 5.
- Data: SQLite in `data/app.db` through Node's built-in `node:sqlite`. No other database package.
- Tests: Node's built-in test runner, calling the API over HTTP through `test/helpers.ts`.
- Not allowed without an ADR: new dependencies, frontend frameworks, ORMs, authentication libraries, extra processes.

## 3. Architecture (details and reasons in docs/architecture.md)
- Three layers: `src/http` (requests and responses), `src/domain` (rules), `src/data` (SQL).
- Dependencies point one way: http -> domain <- data. `src/app.ts` is the only file that wires them together.
- `npm run check` must pass before code is accepted.

## 4. API contract
- Errors are returned as `{ "error": "<CODE>" }`, with codes in UPPER_SNAKE_CASE. Never return stack traces or SQL errors.
- Times are ISO 8601 strings in UTC. The clock is injected (`now`), never read directly in domain code.
- Unknown request fields are rejected, not ignored.

## 5. Security baseline
- Identity is resolved once, at the HTTP boundary, by `requireUser`. Every route uses it.
- The owner of anything comes from identity (`res.locals.userId`), never from the request.
- Every query that reads or changes a gallery filters by owner in the SQL itself.
- A photographer asking for another photographer's gallery gets 404, as if it did not exist (ADR-003).
- Rules the data must always satisfy are also constraints in the schema, not only checks in code.

## 6. Temporary assumptions
- A-1 (until spec 004, login): the current photographer is named in the `X-User-Id` header.
  This is NOT security. It is a recorded assumption that spec 004 replaces.

## 7. Rules we learned (from reviewing agent code)
Each rule records a mistake an agent made, written so the next agent will not repeat it.
- (S4) A listing query must filter by owner in SQL. Loading every row and filtering in code leaks data when the filter is skipped.
- (S4) A request with no identity is rejected with 401. It must never fall back to returning everything.
- (S4) A test that only checks the status code is not evidence. Check which records came back and what is stored.
- (S5)

## 8. Data you may use
Only synthetic data and code written in this workshop. No employer code, no real customer data.
