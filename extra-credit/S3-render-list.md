# Extra credit S3: Render the gallery list

Optional. Same rules as everything else in this workshop.

## Task
A static HTML page served by the same server (from `public/`) that shows the current user's galleries
by calling `GET /api/galleries`.

## The page must handle four states
1. Loading
2. Empty (the user has no galleries)
3. Error (the API fails or returns an error)
4. Data

## Rules
1. Add acceptance criteria to the spec BEFORE writing code: at least one for "empty" and one for "error".
   Commit them first.
2. No frontend framework. Plain HTML + TypeScript or JavaScript.
3. The list is fully reachable with the keyboard; every image (when there are images) has alt text.
4. How does the page send X-User-Id? Decide, and write it in the spec as part of assumption A-1.
5. At least one entry in agent-error-log.md about this task.
6. Tag: `s3-bonus`.

## Review question to answer in SUBMISSION.md
"Where does this page get its data, and what does it show while waiting, when there is nothing, and on error?"
