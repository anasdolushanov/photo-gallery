import { Injectable } from '@angular/core';
import { Photo } from '../models/photo';

const MIN_DELAY_MS = 200;
const MAX_DELAY_MS = 300;
const IMAGE_WIDTH = 200;
const IMAGE_HEIGHT = 300;

/**
 * Provides a simulated random-photo stream backed by https://picsum.photos.
 * Each photo gets a unique seed so its URL stays stable across reloads,
 * which lets favorites and the single-photo page reference it reliably.
 */
@Injectable({ providedIn: 'root' })
export class PhotoService {
  /** Simulates a real API call (200-300ms latency) returning a page of random photos. */
  async loadMore(count: number): Promise<Photo[]> {
    await this.simulateNetworkDelay();
    return Array.from({ length: count }, () => this.createRandomPhoto());
  }

  private createRandomPhoto(): Photo {
    // crypto.randomUUID is unavailable outside secure contexts (e.g. http://<LAN-IP>)
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    // WebP is roughly half the size of picsum's default JPEG
    return { id, url: `https://picsum.photos/seed/${id}/${IMAGE_WIDTH}/${IMAGE_HEIGHT}.webp` };
  }

  private simulateNetworkDelay(): Promise<void> {
    const delayMs = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
    return new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}
