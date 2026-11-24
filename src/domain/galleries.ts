/** A gallery as the rest of the system sees it. The owner is implied by who asked. */
export type Gallery = {
  id: number;
  name: string;
  status: 'draft' | 'published';
  createdAt: string;
  publishedAt: string | null;
};

/** What the domain needs from storage. The data layer implements it. */
export type GalleryStore = {
  listByOwner(ownerId: string): Gallery[];
};

export function createGalleryService(store: GalleryStore) {
  return {
    /** Spec 001: a photographer sees only her own galleries. */
    listMine(ownerId: string): Gallery[] {
      return store.listByOwner(ownerId);
    },
  };
}

export type GalleryService = ReturnType<typeof createGalleryService>;
