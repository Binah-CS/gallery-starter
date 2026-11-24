# Specs library

The agent implements only specs whose status is `REVIEWED`. A human reviews every spec before that.

| Spec | Feature | Status | Session |
|---|---|---|---|
| 001 | List my galleries | IMPLEMENTED (checkpoint `s5-start`) | S4 |
| 002 | Create a gallery | REVIEWED | S5 (in class, or homework) |
| 003 | Publish a gallery | REVIEWED | S6 |
| 004 | Log in (replaces assumption A-1) | DRAFT | S6 |
| 005 | Tell clients when a gallery is published | DRAFT | S7 |

## Every spec has the same sections
1. Problem, scope, out of scope
2. **Human decisions**: each gap in the brief that someone decided, with the reason. An agent must not re-decide these.
3. API contract
4. Data: what is stored, which constraints the schema enforces
5. Acceptance criteria in Given/When/Then; each Then names the response AND the stored state
6. Architecture notes: which layer does what
7. Open questions

## Statuses
- `DRAFT`: being written. The agent may comment on it, not implement it.
- `REVIEWED`: a human checked it; the agent may implement it.
- `IMPLEMENTED`: tests for every criterion pass and the code was reviewed.
