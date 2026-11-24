# Agent instructions

At the start of every session, read `constitution.md` and `docs/architecture.md` and follow them.

## When asked to implement a spec
1. Only from a spec with status `REVIEWED`. If its status is anything else, stop and say so.
2. Before writing code, list:
   - every file you will create or change, and which layer it belongs to;
   - every assumption you are making that the spec does not state.
3. Write the tests first, one per acceptance criterion, named `NNN AC-n: ...`. Use `test/helpers.ts`.
   Run `npm test` and show which fail. Do not change source files in this step.
4. Then implement only what the acceptance criteria require. Nothing extra.
5. Run `npm test` and `npm run check` and show the real output of both.
6. Never edit a test after it was shown failing, unless the human agrees the test is wrong.

## When asked to explain code
Explain what the code actually does, file by file and function by function.
For every SQL statement, say exactly which rows it reads or changes. Do not edit any file.

## Never, without saying so explicitly first
- add a dependency, endpoint, table, column, role or file the spec does not mention;
- put SQL outside `src/data`, or HTTP code outside `src/http`;
- read the owner from the request body, query or path.
