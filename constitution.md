# Constitution

These rules bind both the human and the agent. If a rule blocks you, raise it. Do not silently bend it.

## 1. Process
1. No implementation code until `specs/<feature>/spec.md` exists with status `REVIEWED` and acceptance criteria in Given/When/Then form.
2. Spec loop, one commit per step: yardstick (human) -> agent draft (unedited) -> human review (every change has a reason in `review.md`) -> critique response (fresh agent session, human decides).
3. Commit the spec or ADR BEFORE the code that implements it. Separate commits.
4. Write tests from the acceptance criteria. A test checks the response AND the resulting state.
5. Never claim tests pass unless you ran them and can show the output.
6. When the spec is silent or ambiguous, stop and ask, or state the assumption in plain words. Never guess silently.
7. Small changes: one concern per commit, message says why.
8. A refactor must not change behavior and must not edit tests, unless the spec changed.

## 2. Fixed stack (a constraint: change only via ADR)
- Runtime: Node.js 22 LTS, TypeScript, run with `tsx`.
- One process, one port (3000), serving a JSON API under `/api/*` and, later, static files from `public/`.
- HTTP: Express.
- Data: SQLite in a single file `data/app.db`, via `better-sqlite3`.
  Fallback if it won't install on the lab machines: Node's built-in `node:sqlite` (Node >= 22.13).
- Photo files (later sessions): a local folder `data/photos/`. Bytes never go in the database.
- Tests: Node's built-in test runner (`node --test`) via `tsx`. `npm test` must run them.
- Frontend: plain HTML + TypeScript/JavaScript. No frontend framework.
- Not allowed without an ADR: frontend frameworks, ORMs, authentication libraries, extra processes, message brokers, Docker.

## 3. Data
- Start from access patterns (who reads or writes what, how often), then derive the model.
- Name tables and fields so a reader (human or agent) can tell what they mean. Avoid `data`, `info`, `status2`.
- Constraints belong in the schema (NOT NULL, foreign keys, CHECK), not only in code.
- Client photos are personal data. Every spec states what is kept, for how long, and what delete removes.

## 4. Security baseline (non-negotiable)
- Authorization is enforced on the SERVER for every operation that reads or changes data. Hiding something in the UI enforces nothing.
- Every gallery operation checks ownership.
- Treat all input as untrusted. Validate type, range and shape.
- No secrets in the repository. Environment variables only. Never log secrets.

## 5. Temporary assumptions
- A-1 (S3 until login is built): the current user is identified by the `X-User-Id` request header.
  This is NOT security. It is a recorded assumption that will be replaced.

## 6. Honesty
- Record in `agent-error-log.md` anything the agent got wrong, assumed, or claimed without evidence, and how it was noticed.
- Mark proposals as PROPOSED. Mark executed results with the command that produced them.

## 7. Data you may use
- Only synthetic data and code written in this workshop. No employer code, no real customer data.
