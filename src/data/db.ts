import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export type Db = DatabaseSync;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS photographers (
  id           TEXT PRIMARY KEY,
  display_name TEXT NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS galleries (
  id           INTEGER PRIMARY KEY,
  owner_id     TEXT NOT NULL REFERENCES photographers(id),
  name         TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 100),
  status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at   TEXT NOT NULL,
  published_at TEXT,
  UNIQUE (owner_id, name),
  CHECK ((status = 'published') = (published_at IS NOT NULL))
) STRICT;

CREATE INDEX IF NOT EXISTS galleries_by_owner ON galleries (owner_id);
`;

/** Opens the database, creates the schema, and seeds it once if it is empty. */
export function openDb(path = process.env.DB_PATH ?? 'data/app.db'): Db {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(SCHEMA);
  seedIfEmpty(db);
  return db;
}

function seedIfEmpty(db: Db): void {
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM photographers').get() as { n: number };
  if (n > 0) return;
  const addPhotographer = db.prepare('INSERT INTO photographers (id, display_name) VALUES (?, ?)');
  addPhotographer.run('dana', 'Dana Levi');
  addPhotographer.run('noa', 'Noa Cohen');
  const addGallery = db.prepare(
    'INSERT INTO galleries (owner_id, name, status, created_at, published_at) VALUES (?, ?, ?, ?, ?)',
  );
  addGallery.run('dana', 'Levi wedding', 'draft', '2026-11-01T09:00:00.000Z', null);
  addGallery.run('dana', 'Cohen bar mitzvah', 'published', '2026-11-02T09:00:00.000Z', '2026-11-03T18:30:00.000Z');
  addGallery.run('noa', 'Tel Aviv portraits', 'draft', '2026-11-04T09:00:00.000Z', null);
}
