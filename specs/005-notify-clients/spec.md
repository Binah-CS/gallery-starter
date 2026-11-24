# Spec 005: Tell clients when a gallery is published

Status: DRAFT (to be reviewed in session 7; do not implement)

## 1. Problem and scope
Brief: "Clients should hear about it when that happens." When a gallery is published, each of its clients gets an email.
The email service is external, slow (about 2 seconds) and sometimes fails. The repo will supply a fake that behaves that way.
In scope: linking clients to a gallery, sending one email per client per publication, retrying failures.
Out of scope: client accounts, clients viewing galleries, email content and design.

## 2. Human decisions (proposed, to be confirmed in session 7)
| # | Proposed decision | Reason |
|---|---|---|
| D1 | Publishing does not wait for emails. It records one notification job per client in the same transaction as the status change | A slow or failing email service must not slow or fail publishing |
| D2 | A worker inside the same process sends pending jobs | No second service to run (ADR-001) |
| D3 | Each job has an idempotency key (gallery id + client email + publication); the fake service ignores a key it has already accepted | A retry must not send a second email |
| D4 | Failed sends retry with growing delays, at most 5 attempts, then the job is marked `failed` and kept | Failures stay visible instead of disappearing |
| D5 | Publishing an already published gallery creates no new jobs | Follows spec 003 D2 |

## 3. Data (proposed)
- `gallery_clients (gallery_id, email)`
- `notification_jobs (id, gallery_id, email, idempotency_key UNIQUE, status, attempts, next_attempt_at, last_error)`

## 4. Acceptance criteria
To be written in session 7.

## 5. Open questions
- Q1: Who adds clients to a gallery, and through which endpoint?
- Q2: Does the photographer see failed notifications? Where?
- Q3: What if a client is added after the gallery was published?
