import { PhotoService } from './photo';

describe('PhotoService', () => {
  let service: PhotoService;

  beforeEach(() => {
    service = new PhotoService();
  });

  it('resolves with the requested number of photos, each with a unique id and a stable picsum url', async () => {
    const photos = await service.loadMore(5);

    expect(photos).toHaveLength(5);
    expect(new Set(photos.map((p) => p.id)).size).toBe(5);
    for (const photo of photos) {
      expect(photo.url).toBe(`https://picsum.photos/seed/${photo.id}/200/300.webp`);
    }
  });

  it('emulates network latency instead of resolving instantly', async () => {
    vi.useFakeTimers();
    try {
      let resolved = false;
      service.loadMore(1).then(() => (resolved = true));

      await vi.advanceTimersByTimeAsync(150);
      expect(resolved).toBe(false);

      await vi.advanceTimersByTimeAsync(200);
      expect(resolved).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});
