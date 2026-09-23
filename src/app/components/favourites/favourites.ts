import { Component, OnInit, signal } from '@angular/core';
import { ImageComponent } from '../image/image';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [ImageComponent],
  templateUrl: './favourites.html',
  styleUrl: './favourites.scss'
})
export class Favourites implements OnInit {
  favouriteUrls = signal<string[]>([]);

  ngOnInit(): void {
    this.loadFavourites();
  }

  loadFavourites(): void {
    try {
      const rawFavourites = localStorage.getItem('favourites');
      const favourites: string[] = rawFavourites ? JSON.parse(rawFavourites) : [];
      this.favouriteUrls.set(favourites);
    } catch (error) {
      console.error('Error reading favourites from localStorage:', error);
    }
  }

  clearFavourites(): void {
    localStorage.removeItem('favourites');
    this.favouriteUrls.set([]);
  }
}