import { Router, type RequestHandler } from 'express';
import type { GalleryService } from '../domain/galleries.ts';

export function galleriesRoutes(service: GalleryService, requireUser: RequestHandler): Router {
  const router = Router();

  // Spec 001: list my galleries
  router.get('/api/galleries', requireUser, (_req, res) => {
    res.json(service.listMine(res.locals.userId));
  });

  return router;
}
