import type { Db } from './db.ts';
import type { Gallery } from '../domain/galleries.ts';

type GalleryRow = {
  id: number;
  name: string;
  status: 'draft' | 'published';
  created_at: string;
  published_at: string | null;
};

export type GalleriesRepo = {
  /** Galleries owned by ownerId, oldest first. The owner filter is in the query. */
  listByOwner(ownerId: string): Gallery[];
};

function toGallery(row: GalleryRow): Gallery {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    createdAt: row.created_at,
    publishedAt: row.published_at,
  };
}

export function createGalleriesRepo(db: Db): GalleriesRepo {
  const byOwner = db.prepare(
    'SELECT id, name, status, created_at, published_at FROM galleries WHERE owner_id = ? ORDER BY id',
  );
  return {
    listByOwner(ownerId) {
      return (byOwner.all(ownerId) as GalleryRow[]).map(toGallery);
    },
  };
}
