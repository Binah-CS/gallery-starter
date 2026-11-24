# Review card: what a human checks before accepting agent code

Work through it in order. Stop at the first "no" and fix it before going on.

## 1. Does it do what the spec says?
- [ ] Every acceptance criterion has a test named after it.
- [ ] Each test checks the response AND the stored state its criterion names.
- [ ] Nothing was built that the spec did not ask for (endpoints, fields, dependencies, tables).
- [ ] No "Human decision" in the spec was quietly re-decided.

## 2. Is there evidence?
- [ ] I ran `npm test` myself, and it passes.
- [ ] I ran `npm run check` myself, and it passes.
- [ ] No test was changed after it was shown failing (`git log -p test/`).

## 3. Data and ownership (S4)
- [ ] No request can return or change another photographer's data, including with no or unknown identity.
- [ ] Every gallery query filters by owner in the SQL itself.
- [ ] Rules the data must always satisfy are schema constraints, not only code checks.

## 4. Architecture (S5)
- [ ] Each piece of code is in the layer that owns that kind of decision (http / domain / data).
- [ ] Each rule lives in exactly one place, not copied into several handlers.
- [ ] Nothing that must survive a restart is kept in server memory.
- [ ] A check-then-act pair (read, decide, write) is not used where a constraint or a conditional write would be safe.
- [ ] I can say what would break first with 100 times the users.

## 5. Can I explain it?
- [ ] I can explain every function the agent wrote, without looking at its explanation.
