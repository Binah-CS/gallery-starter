# ADR-003: Ownership is enforced in the query; another owner's gallery is 404

Status: accepted
Date: 2026-11-22
Decided by: the course instructor

## Context
"She does not want anyone else touching her galleries" (brief). Two decisions follow:
where the ownership rule is enforced, and what a photographer sees when she asks for a gallery that is not hers.

## Options considered
Where:
1. Load the gallery, then compare its owner in code. Easy to read, easy to forget, and a second query between the two steps can see a different state.
2. **Put the owner in the WHERE clause of every query that reads or changes a gallery.** A query cannot return or change what it does not select.

What the caller sees:
1. 403 Forbidden: honest, but it confirms that gallery id 7 exists and belongs to someone.
2. **404 Not found: the same answer as for a gallery that does not exist.** Reveals nothing.

## Decision
Owner in the WHERE clause of every gallery query. Another owner's gallery is 404 `GALLERY_NOT_FOUND`.

## Why
Enforcing in the query makes the rule hard to skip and keeps it in one layer (R1).
404 avoids leaking which ids exist, which matters once galleries belong to real clients.

## Consequences
- The data layer's functions take the owner as an argument: `findOwned(id, ownerId)`, not `findById(id)`.
- Debugging is slightly harder: a 404 may mean "not yours". Logs (later) record the difference; responses do not.

## Where it is enforced
Constitution section 5, check rule R5 (owner never from the request), tests in specs 002 and 003, human review of `src/data`.

## With 100 times the users
Holds. The index on `owner_id` keeps owner-filtered queries fast.
