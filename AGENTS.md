# Agent instructions

Read `constitution.md` first and follow it. It fixes the stack: do not choose another.

## When asked to implement
1. Only from a spec with status `REVIEWED`. If there is none, stop and say so.
2. Before writing code, list the files you will create or change and every assumption you are making.
3. Implement only what the spec's acceptance criteria require. Nothing extra.
4. Run `npm test` and show the real output. Never say tests pass without running them.

## When asked to write tests first
- Write only tests. Do not change source files. Run the tests and show which fail.

## When asked to explain code
- Explain what the code actually does, file by file. Do not edit any file.

Never add dependencies, endpoints, roles or files that are not in the spec without saying so explicitly.
