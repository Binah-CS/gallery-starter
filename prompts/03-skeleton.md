# Prompt 03: Walking skeleton (S3, minutes 105-140)

Copy everything between the lines.

---
Read constitution.md, AGENTS.md and specs/001-galleries/spec.md (status must be REVIEWED).
Build the smallest walking skeleton, using exactly the stack fixed in the constitution:
- package.json with "start" and "test" scripts
- SQLite database at data/app.db with a galleries table derived from the spec's data section,
  created and seeded on startup if empty: two galleries owned by "dana", one owned by "noa"
- GET /api/galleries returning, as JSON, only the galleries owned by the user in the X-User-Id header
  (assumption A-1). Filter by owner in the query, not after loading all rows.
- One automated test for the listing acceptance criterion: "dana" receives exactly her two galleries,
  none of "noa"'s, and the number of rows in the table is unchanged.
Do NOT add a frontend, a frontend framework, an ORM, real authentication, or any endpoint not listed.
Before writing code: list the files you will create, the dependencies you will add, and every assumption you are making.
After writing code: run npm test and show me the real output.
---
