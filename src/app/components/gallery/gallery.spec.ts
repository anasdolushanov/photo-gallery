import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gallery } from './gallery';
import { PhotoService } from '../../services/photo';
import { FavoritesService } from '../../services/favorites';
import { Photo } from '../../models/photo';

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  static sentinelVisible = false;
  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    FakeIntersectionObserver.instances.push(this);
  }

  // A real observer reports the current state asynchronously right after observe()
  observe = vi.fn(() => queueMicrotask(() => this.trigger(FakeIntersectionObserver.sentinelVisible)));
  unobserve = vi.fn();
  disconnect = vi.fn();

  trigger(isIntersecting: boolean): void {
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

function makePhotos(count: number, prefix = 'id'): Photo[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i}`,
    url: `https://picsum.photos/seed/${prefix}-${i}/200/300`,
  }));
}

describe('Gallery', () => {
  let fixture: ComponentFixture<Gallery>;
  let component: Gallery;
  let photoService: { loadMore: ReturnType<typeof vi.fn> };
  let favoritesService: { add: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    (globalThis as any).IntersectionObserver = FakeIntersectionObserver;
    FakeIntersectionObserver.instances = [];
    FakeIntersectionObserver.sentinelVisible = false;

    photoService = { loadMore: vi.fn().mockResolvedValue(makePhotos(9)) };
    favoritesService = { add: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Gallery],
      providers: [
        { provide: PhotoService, useValue: photoService },
        { provide: FavoritesService, useValue: favoritesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Gallery);
    component = fixture.componentInstance;
  });

  it('loads an initial page of photos on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(photoService.loadMore).toHaveBeenCalledWith(9);
    expect(component.photos()).toHaveLength(9);
  });

  it('loads another page when the scroll sentinel intersects', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    photoService.loadMore.mockResolvedValue(makePhotos(9, 'page2'));
    FakeIntersectionObserver.instances[0].trigger(true);
    await fixture.whenStable();

    expect(photoService.loadMore).toHaveBeenCalledTimes(2);
    expect(component.photos()).toHaveLength(18);
  });

  it('keeps loading pages while the sentinel stays visible, until the viewport is filled', async () => {
    FakeIntersectionObserver.sentinelVisible = true;
    let page = 0;
    photoService.loadMore.mockImplementation(async () => {
      page++;
      if (page === 3) FakeIntersectionObserver.sentinelVisible = false;
      return makePhotos(9, `page${page}`);
    });

    fixture.detectChanges();

    await vi.waitFor(() => expect(component.photos()).toHaveLength(27));
    await fixture.whenStable();
    expect(photoService.loadMore).toHaveBeenCalledTimes(3);
  });

  it('adds a photo to favorites when it is clicked', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const [firstPhoto] = component.photos();
    component.addFavorite(firstPhoto);

    expect(favoritesService.add).toHaveBeenCalledWith(firstPhoto);
  });

  it('shows a loading indicator while a page is being fetched', async () => {
    let resolveLoadMore!: (photos: Photo[]) => void;
    photoService.loadMore.mockReturnValue(
      new Promise<Photo[]>((resolve) => (resolveLoadMore = resolve)),
    );

    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.isLoading()).toBe(true);

    resolveLoadMore(makePhotos(9));
    await fixture.whenStable();
    expect(component.isLoading()).toBe(false);
  });
});
