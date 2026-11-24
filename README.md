# Gallery

A photographer gallery, built by an agent from specs that humans decide and review.
The goal of the workshop: **never merge agent code you can't explain.**

Checkpoint `s5-start`: spec 001 is implemented and reviewed. Everyone starts from here.

## Start of every session
1. On GitHub, open YOUR fork and click **Sync fork**. If it offers "Discard commits", choose it.
2. `git pull`, then `npm install`.
3. `npm run doctor` (all OK), `npm test` (all pass), `npm run check` (passes).
4. Start Copilot CLI in the repo folder and ask:
   "Read AGENTS.md, constitution.md and docs/architecture.md and tell me the rules you will follow."

## Where the human decisions live
| Artifact | Holds | Read by the agent? | Enforced by a machine? |
|---|---|---|---|
| `specs/NNN-*/spec.md` | What one feature must do, and the decisions behind it | Yes | Through the tests written from it |
| `constitution.md` | Rules that hold for every feature | Yes | Partly (`npm run check`, CI) |
| `docs/architecture.md` | The parts of the system, who does what, what may depend on what | Yes | Yes: `npm run check` |
| `docs/adr/` | Why each significant decision was made, and what was rejected | Yes | No |
| `test/` | Evidence that each acceptance criterion holds | Yes | Yes: `npm test`, CI |
| `review-card.md` | What a human checks before accepting agent code | No | No: this part is you |

## Commands
| Command | What it does |
|---|---|
| `npm start` | Runs the API on http://localhost:3000 |
| `npm test` | Runs all tests |
| `npm run check` | Runs the architecture check (rules R1-R5) |
| `npm run doctor` | Checks this machine can run the stack |
| `node tools/probe.mjs dana` | Sends one request to the running server and prints the answer |

## Specs
See `specs/README.md`.
