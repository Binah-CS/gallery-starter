/** A failure the client can act on. `code` is part of the API contract; `status` is the HTTP status. */
export class AppError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message = code,
  ) {
    super(message);
  }
}
