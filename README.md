# Gallery Starter (greenfield)

Workshop project: a photographer gallery, built from an empty repo.
There is **no application code here on purpose**. You and your agent create it, spec first.

## First 10 minutes (every session)
1. Fork this repo to YOUR GitHub account. Clone YOUR fork.
2. Open a terminal in the repo folder and start your agent CLI.
3. Ask: "Read AGENTS.md and constitution.md and tell me the rules you will follow."
   If it doesn't mention the constitution, check docs/known-issues.md.
4. Make a small commit and push. Check the Actions tab: CI should run.

## Where things live
| Path | What |
|---|---|
| `constitution.md` | Rules for you AND your agent, including the fixed stack |
| `AGENTS.md` | Tool-neutral agent instructions (each tool's pointer file points here) |
| `docs/brief.md` | The customer's request. Deliberately vague |
| `specs/_template/` | Templates: spec, yardstick, review, open questions |
| `specs/001-galleries/` | Your first spec (created in S3) |
| `prompts/` | The prompts used in class. Copy them as they are |
| `docs/adr/` | Decision records |
| `agent-error-log.md` | What the agent got wrong or assumed. Required every session |
| `SUBMISSION.md` | What you submit each session |
| `extra-credit/` | Optional bonus tasks |
| `docs/known-issues.md` | Fixes for tool and lab problems |

## The S3 commit sequence
```
spec: yardstick            <- you, no agent
spec: agent draft          <- agent, untouched
spec: human review         <- you, every change with a reason
spec: critique response    <- fresh agent session critiques, you decide
feat: ...                  <- only now, code
```
The commit history is the evidence. Don't squash it.
