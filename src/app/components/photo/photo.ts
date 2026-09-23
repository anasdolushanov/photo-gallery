import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { FavoritesService } from '../../services/favorites';

@Component({
  selector: 'app-photo',
  standalone: true,
  imports: [MatButton],
  templateUrl: './photo.html',
  styleUrl: './photo.scss',
})
export class Photo {
  private readonly router = inject(Router);
  private readonly favoritesService = inject(FavoritesService);

  id = input.required<string>();

  photo = computed(() => this.favoritesService.getById(this.id()));

  removeFromFavorites(): void {
    this.favoritesService.remove(this.id());
    this.router.navigate(['/favorites']);
  }
}
