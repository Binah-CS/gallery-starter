# Constitution

These rules bind both the human and the agent. If a rule blocks you, raise it. Do not silently bend it.

## 1. Process
1. Implement only from a spec in `specs/` with status `REVIEWED`.
2. Acceptance criteria are committed BEFORE the code they govern, in a separate commit.
3. For a fix or a new criterion: write the test first, run it, see it fail, commit it. Then change the code.
4. Never claim tests pass unless you ran them and can show the output.
5. When the spec is silent or ambiguous, stop and ask, or state the assumption in plain words. Never guess silently.
6. Nothing is done until both members of the pair can explain every function in it.

## 2. Fixed stack (change only with the instructor's agreement)
- Node.js 22.13 or newer, TypeScript, run with `tsx`. ES modules (`"type": "module"`).
- One process on port 3000 serving a JSON API under `/api/*`.
- HTTP: Express.
- Data: SQLite in the single file `data/app.db`, through Node's built-in `node:sqlite` module. No other database package.
- Tests: Node's built-in test runner. `npm test` runs `tsx --test test/*.test.ts`. Tests call the API over HTTP.
- `npm start` runs the server.
- Not allowed: frontend frameworks, ORMs, authentication libraries, extra processes, Docker.

## 3. Temporary assumptions
- A-1 (until login is built in session 6): the current user is identified by the `X-User-Id` request header.
  This is NOT security. It is a recorded assumption that will be replaced.

## 4. Data you may use
- Only synthetic data and code written in this workshop. No employer code, no real customer data.

## 5. Rules we learned
Each session, the pair adds at least one rule here, taken from what the agent got wrong.
Write each rule so that an agent reading it would not repeat the mistake.

- (S4)
