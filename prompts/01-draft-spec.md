# Prompt 01: Agent drafts the spec (S3, minutes 48-55)

Copy everything between the lines.

---
Read constitution.md, AGENTS.md and docs/brief.md.
Create specs/001-galleries/spec.md and specs/001-galleries/open-questions.md,
using the structure in specs/_template/spec.md and specs/_template/open-questions.md.

Scope for this spec: photographers' galleries - listing my galleries and publishing a gallery.

Rules:
- Start with the access patterns table, then derive data and requirements from it.
- Include acceptance criteria for: listing my galleries (including another owner's galleries in the data),
  publishing a gallery, a different user trying to publish someone else's gallery, and invalid input.
  Every "Then" states the response AND the resulting state.
- Include an API sketch for GET /api/galleries.
- Keep assumption A-1 from the constitution.
- Mark every statement you inferred rather than read in the brief as ASSUMPTION.
- Put everything you do not know in open-questions.md. Do not invent answers.
- Do NOT write any code. Do NOT create any other files.
When done, list the five assumptions you are least sure about.
---
