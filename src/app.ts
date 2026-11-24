import express from 'express';
import type { Db } from './data/db.ts';
import { createGalleriesRepo } from './data/galleries.repo.ts';
import { createPhotographersRepo } from './data/photographers.repo.ts';
import { createGalleryService } from './domain/galleries.ts';
import { requireUser } from './http/identity.ts';
import { galleriesRoutes } from './http/galleries.routes.ts';
import { errorHandler, notFound } from './http/errors.ts';

export type AppOptions = {
  db: Db;
  /** The clock. Tests pass a fixed one. */
  now?: () => Date;
};

/** The composition root: the only place that knows every layer. */
export function createApp({ db, now = () => new Date() }: AppOptions) {
  const photographers = createPhotographersRepo(db);
  const galleries = createGalleryService(createGalleriesRepo(db));
  const identity = requireUser((id) => photographers.exists(id));
  void now; // used by later specs (002, 003)

  const app = express();
  app.use(express.json());
  app.use(galleriesRoutes(galleries, identity));
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
