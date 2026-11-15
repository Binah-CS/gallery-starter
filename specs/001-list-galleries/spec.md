# Spec 001: List galleries

Status: REVIEWED

## Problem
A photographer wants to see her galleries.

## Scope
In scope: listing galleries through the API.
Out of scope: creating, editing, publishing, photos, login, any user interface.

## Data
A gallery has a name, belongs to a photographer, and is either a draft or published.
On first start, if there are no galleries, create three:
"Levi wedding" and "Cohen bar mitzvah" belonging to dana, and "Tel Aviv portraits" belonging to noa.

## Requirements
FR-1: The system shall provide `GET /api/galleries`, returning the galleries as JSON.

## Assumptions
A-1: The current user is identified by the `X-User-Id` request header (see constitution).

## Acceptance criteria
AC-1 (list galleries)
- Given galleries exist
- When the photographer requests the list
- Then the galleries are returned

<!-- Session 4: the pair adds AC-2 onward below this line, by hand, before any fix. -->
