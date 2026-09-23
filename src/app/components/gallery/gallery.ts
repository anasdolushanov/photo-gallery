import {
  AfterViewInit,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  ViewChild,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ImageComponent } from '../image/image';
import { FavoritesService } from '../../services/favorites';
import { PhotoService } from '../../services/photo';
import { Photo } from '../../models/photo';

const PAGE_SIZE = 9;

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [ImageComponent, MatProgressSpinner],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery implements AfterViewInit, OnDestroy {
  private readonly photoService = inject(PhotoService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly injector = inject(Injector);

  @ViewChild('sentinel') private sentinel?: ElementRef<HTMLElement>;
  private observer?: IntersectionObserver;

  photos = signal<Photo[]>([]);
  isLoading = signal(false);

  ngAfterViewInit(): void {
    this.loadMore();
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  addFavorite(photo: Photo): void {
    this.favoritesService.add(photo);
  }

  private setupIntersectionObserver(): void {
    if (!this.sentinel) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.loadMore();
        }
      },
      // Fetch the next page a full screen early: picsum takes 1-2s per image,
      // so photos are ready by the time the user scrolls to them
      { rootMargin: '0px 0px 100% 0px' },
    );

    this.observer.observe(this.sentinel.nativeElement);
  }

  private async loadMore(): Promise<void> {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    try {
      const newPhotos = await this.photoService.loadMore(PAGE_SIZE);
      this.photos.update((prev) => [...prev, ...newPhotos]);
    } finally {
      this.isLoading.set(false);
      afterNextRender(() => this.recheckSentinel(), { injector: this.injector });
    }
  }

  // IntersectionObserver only reports visibility changes; re-observing forces a fresh
  // check so pages keep loading until the sentinel is pushed out of the viewport.
  private recheckSentinel(): void {
    const sentinel = this.sentinel?.nativeElement;
    if (!this.observer || !sentinel) return;
    this.observer.unobserve(sentinel);
    this.observer.observe(sentinel);
  }
}
