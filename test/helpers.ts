import type { AddressInfo } from 'node:net';
import { createApp } from '../src/app.ts';
import { openDb, type Db } from '../src/data/db.ts';

export const FIXED_NOW = new Date('2026-11-24T10:00:00.000Z');

export type CallOptions = { user?: string; body?: unknown; rawBody?: string };

/** Starts the app on a random port with a fresh in-memory database and a fixed clock. */
export async function startTestApp(dbPath = ':memory:') {
  const db: Db = openDb(dbPath);
  const server = createApp({ db, now: () => FIXED_NOW }).listen(0);
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));
  const { port } = server.address() as AddressInfo;

  async function call(method: string, path: string, { user, body, rawBody }: CallOptions = {}) {
    const headers: Record<string, string> = {};
    if (user !== undefined) headers['X-User-Id'] = user;
    let payload: string | undefined;
    if (rawBody !== undefined) payload = rawBody;
    else if (body !== undefined) payload = JSON.stringify(body);
    if (payload !== undefined) headers['Content-Type'] = 'application/json';
    const res = await fetch(`http://localhost:${port}${path}`, { method, headers, body: payload });
    const text = await res.text();
    return { status: res.status, body: text ? JSON.parse(text) : null };
  }

  /** Reads stored state directly, so tests can check what was saved, not only what was returned. */
  function rows(sql: string, ...params: (string | number | null)[]) {
    // node:sqlite returns null-prototype rows; copy them into plain objects so deepEqual works.
    return db.prepare(sql).all(...params).map((row) => ({ ...row })) as Record<string, unknown>[];
  }

  async function close() {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    db.close();
  }

  return { call, rows, close, db };
}
