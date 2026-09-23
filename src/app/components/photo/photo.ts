import { Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-photo',
  standalone: true,
  imports: [],
  templateUrl: './photo.html',
  styleUrl: './photo.scss'
})
export class Photo {
  private router = inject(Router);

  id = input.required<string>();

  imageUrl = signal<string | null>(null);

  constructor() {
    effect(() => {
      const currentId = this.id();
      
      if (currentId) {
        this.loadPhoto(currentId);
      }
    });
  }

  private loadPhoto(idString: string): void {
    const index = parseInt(idString, 10);

    try {
      const rawFavourites = localStorage.getItem('favourites');
      const favourites: string[] = rawFavourites ? JSON.parse(rawFavourites) : [];

      if (!isNaN(index) && index >= 0 && index < favourites.length) {
        this.imageUrl.set(favourites[index]);
      } else {
        console.warn('Invalid photo ID or item not found.');
        this.imageUrl.set(null);
      }
    } catch (error) {
      console.error('Error reading photo from localStorage:', error);
    }
  }

  removePhoto(): void {
    const index = parseInt(this.id(), 10);

    try {
      const rawFavourites = localStorage.getItem('favourites');
      let favourites: string[] = rawFavourites ? JSON.parse(rawFavourites) : [];

      if (!isNaN(index) && index >= 0 && index < favourites.length) {
        favourites.splice(index, 1);
        localStorage.setItem('favourites', JSON.stringify(favourites));
        this.router.navigate(['/favourites']);
      }
    } catch (error) {
      console.error('Error removing photo:', error);
    }
  }
}