import type { RequestHandler } from 'express';
import { AppError } from '../domain/errors.ts';

/**
 * Assumption A-1 (until spec 004, login): the current photographer is named in the X-User-Id header.
 * This is NOT security. It is resolved here, once, at the HTTP boundary (ADR-002).
 */
export function requireUser(isKnownPhotographer: (id: string) => boolean): RequestHandler {
  return (req, res, next) => {
    const userId = req.header('X-User-Id')?.trim();
    if (!userId) return next(new AppError(401, 'IDENTITY_MISSING'));
    if (!isKnownPhotographer(userId)) return next(new AppError(401, 'IDENTITY_UNKNOWN'));
    res.locals.userId = userId;
    next();
  };
}
