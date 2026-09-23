import { Injectable, signal } from '@angular/core';
import { Photo } from '../models/photo';

const STORAGE_KEY = 'favorites';

/** Manages the favorite photos list, persisted to localStorage so it survives page refreshes. */
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly favoritesState = signal<Photo[]>(this.readFromStorage());

  readonly favorites = this.favoritesState.asReadonly();

  isFavorite(id: string): boolean {
    return this.favoritesState().some((photo) => photo.id === id);
  }

  getById(id: string): Photo | undefined {
    return this.favoritesState().find((photo) => photo.id === id);
  }

  add(photo: Photo): void {
    if (this.isFavorite(photo.id)) {
      return;
    }
    this.updateFavorites([...this.favoritesState(), photo]);
  }

  remove(id: string): void {
    this.updateFavorites(this.favoritesState().filter((photo) => photo.id !== id));
  }

  private updateFavorites(favorites: Photo[]): void {
    this.favoritesState.set(favorites);
    this.writeToStorage(favorites);
  }

  private readFromStorage(): Photo[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private writeToStorage(favorites: Photo[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // localStorage unavailable (private browsing, quota) - favorites remain in-memory only
    }
  }
}
