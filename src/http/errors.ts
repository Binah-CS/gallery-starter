import type { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError } from '../domain/errors.ts';

export const notFound: RequestHandler = (_req, _res, next) => next(new AppError(404, 'NOT_FOUND'));

/** Turns errors into the API's error contract: { "error": "<CODE>" }. Never leaks internals. */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.code });
    return;
  }
  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'INVALID_JSON' });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'INTERNAL' });
};
