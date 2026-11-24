# S5: implement spec 002 with the agent

Work alone, in YOUR fork. Before starting: `git pull`, `npm install`, `npm test` and `npm run check` pass.

## Step 1: tests first
Copy everything between the lines into Copilot.

---
Read constitution.md, AGENTS.md, docs/architecture.md and specs/002-create-gallery/spec.md.
Step 1 only: write the tests for spec 002 in test/002-create-gallery.test.ts, one test per acceptance
criterion, named "002 AC-n: ...", using test/helpers.ts. Each test checks the response AND the stored state.
Do NOT change any file under src.
Before writing, list every assumption you are making that the spec does not state.
Then run npm test and show me the real output.
---

Read the tests before continuing. For each test: does it check what its criterion's Then and And say?
Commit: `git add test && git commit -m "test: spec 002 acceptance tests (failing)"`

## Step 2: implement

---
Now implement spec 002 so that the tests pass. Do NOT edit any test.
Before changing code, list every file you will change and which layer it is in.
Follow the "Human decisions" table in the spec; do not re-decide any of them.
After changing code, run npm test and npm run check and show me the real output of both.
---

Commit: `git add -A && git commit -m "feat: spec 002 create gallery"`, then `git push`.

## Step 3: review (this is the part that matters)
Use review-card.md. Answer the agent-run questions in the exit quiz.
