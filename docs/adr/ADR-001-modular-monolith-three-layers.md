# ADR-001: Modular monolith in three layers, enforced by a check

Status: accepted
Date: 2026-11-22
Decided by: the course instructor

## Context
An agent writes most of the code. Without a stated structure it puts code wherever the prompt leads:
SQL inside route handlers, ownership checks in some handlers and not others. A typical first build of
spec 001 from a thin spec loads every gallery and filters in a route. Each such choice is reasonable alone and
together they make the code impossible to review: there is no single place to check "does every query filter by owner?"

## Options considered
1. **One file, no structure.** Fastest to start. Nothing to review against; every change can touch anything.
2. **Separate services** (for example a galleries service and an identity service). Clear boundaries,
   but network calls, separate deployment and distributed failures, for an app one team runs on one machine.
3. **One process, three layers: http, domain, data.** Clear places for each kind of code, no network cost.

## Decision
Option 3: a modular monolith with three layers. Dependencies point inward: http -> domain <- data.
`src/app.ts` is the only file that wires the layers together.

## Why
The boundaries give a reviewer, human or agent, one place to look for each question:
"is every query filtered by owner?" is answered by reading `src/data` only.
Splitting into services would add failure modes the course is not yet ready to handle and that this app does not need.

## Consequences
- More files than the simplest version. Each new feature touches up to three layers.
- The domain can be tested without HTTP or a database.
- Moving from SQLite to a server database changes only `src/data`.

## Where it is enforced
`docs/architecture.md`, constitution section 3, and `npm run check` rules R1-R3 (in CI on every push).

## With 100 times the users
Still holds. Scaling first means running several copies of this same process, not splitting it.
A service would split off only when one part needs a different scaling profile or team, for example a photo-processing worker.
