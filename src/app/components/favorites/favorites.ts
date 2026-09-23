import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ImageComponent } from '../image/image';
import { FavoritesService } from '../../services/favorites';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [ImageComponent],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {
  private readonly router = inject(Router);
  private readonly favoritesService = inject(FavoritesService);

  favorites = this.favoritesService.favorites;

  openPhoto(id: string): void {
    this.router.navigate(['/photos', id]);
  }
}
