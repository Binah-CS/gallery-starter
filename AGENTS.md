# Agent instructions (tool-neutral)

Read `constitution.md` first and follow it. It fixes the stack: do not choose another.

## When asked to draft a spec
- Use the structure in `specs/_template/spec.md`.
- Start from access patterns, then requirements.
- Mark every statement you inferred rather than read in `docs/brief.md` as an ASSUMPTION.
- Put everything you don't know in `open-questions.md`. Do not invent answers.
- Do not write any code.

## When asked to critique a spec
- Do NOT edit any file. List findings only. The human decides.

## When asked to implement
1. Only from a spec with status `REVIEWED`. If there is none, stop and say so.
2. Before writing code, list the files you will create or change and every assumption you are making.
3. Implement only what the named acceptance criteria require. Nothing extra.
4. Run `npm test` and show the real output. Never say tests pass without running them.

## When asked to explain code
- Explain what the code actually does, file by file. Point out anything that doesn't match the spec.

Never add dependencies, endpoints, roles or files that are not in the spec without saying so explicitly.
