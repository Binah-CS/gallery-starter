# ADR-002: Identity is resolved once at the HTTP boundary; missing or unknown identity is 401

Status: accepted
Date: 2026-11-22
Decided by: the course instructor (from session 4 reviews)

## Context
Until login exists (spec 004), the photographer is named in the `X-User-Id` header (assumption A-1).
When spec 001 did not say what happens without the header, a first build could treat it in three different ways:
return every gallery, return an empty list, or crash. An unknown user would typically get 200 and an empty list.

## Options considered
1. **Each route reads the header itself.** Simple, but every new route is a chance to forget.
2. **Missing identity returns an empty list; unknown identity returns an empty list.** Never fails, but hides mistakes:
   a client with a typo in its user id silently sees nothing, and "no identity" looks the same as "no galleries".
3. **One middleware, `requireUser`, on every route. Missing identity: 401 `IDENTITY_MISSING`. Unknown: 401 `IDENTITY_UNKNOWN`.**

## Decision
Option 3.

## Why
Failing loudly makes the mistake visible at once. One middleware means one place to replace when spec 004 adds login:
the routes do not change.

## Consequences
- Spec 004 changes `src/http/identity.ts` and nothing in the routes.
- Every route needs `requireUser`; forgetting it is caught by `npm run check` (R4).

## Where it is enforced
Constitution section 5, `src/http/identity.ts`, tests 001 AC-3 and AC-4, check rule R4.

## With 100 times the users
The lookup of the photographer runs on every request. At scale it would be cached or carried in a signed session (spec 004).
