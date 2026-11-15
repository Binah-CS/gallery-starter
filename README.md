# Gallery Starter

Workshop project: a photographer gallery, built from an empty repo by you and your agent.
The goal of the workshop: **never merge agent code you can't explain.**

## Start of every session
1. One repo per pair. On GitHub, **Sync fork** (if it reports a conflict, choose "Discard commits").
2. `git pull`, then `node tools/doctor.mjs`. All lines must say OK.
3. Start Copilot CLI in the repo folder and ask:
   "Read AGENTS.md and constitution.md and tell me the rules you will follow."

## Where things live
| Path | What |
|---|---|
| `constitution.md` | Rules for you and your agent. You add a rule every session |
| `AGENTS.md` | Agent instructions |
| `docs/brief.md` | The customer's request. Deliberately vague |
| `specs/` | One folder per feature, with its spec and acceptance criteria |
| `prompts/` | The prompts used in class. Copy them as they are |
| `sessions/` | One file per session: your predictions, findings and decision |
| `review-card.md` | Your checklist for reviewing agent code. It grows every session |
| `tools/doctor.mjs` | Checks this machine can run the stack |
| `tools/probe.mjs` | Sends one request to your running server and prints the answer |

## The loop
criteria (by hand) -> predict -> agent builds -> review against the criteria -> failing test, then fix -> record

Criteria are committed before the code they govern. The commit history is the evidence.
