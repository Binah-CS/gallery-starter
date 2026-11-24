import type { Db } from './db.ts';

export type PhotographersRepo = {
  exists(id: string): boolean;
};

export function createPhotographersRepo(db: Db): PhotographersRepo {
  const findById = db.prepare('SELECT 1 AS found FROM photographers WHERE id = ?');
  return {
    exists(id) {
      return findById.get(id) !== undefined;
    },
  };
}
