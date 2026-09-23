import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image',
  standalone: true,
  templateUrl: './image.html',
  styleUrl: './image.scss',
  host: {
    '(click)': 'handleClick()'
  }
})
export class ImageComponent implements OnInit {
  private router = inject(Router);

  src = input<string | null>(null);
  favouriteId = input<number | null>(null);

  seed = input<number | string>(Date.now());

  realUrl = signal<string | null>(null);
  isLoading = signal<boolean>(true);

  async ngOnInit(): Promise<void> {
    if (this.src()) {
      this.realUrl.set(this.src());
      this.isLoading.set(false);
      return;
    }

    const initialUrl = `https://picsum.photos/300/300?random=${this.seed()}`;

    try {
      const response = await fetch(initialUrl, { method: 'GET' });
      this.realUrl.set(response.url);
    } catch (error) {
      console.error('Error resolving image redirect:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  handleClick(): void {
    const favId = this.favouriteId();

    console.log("Here", this.favouriteId());

    if (favId !== null && favId !== undefined) {
      console.log("Here 2");

      this.router.navigate(['/photos', favId]);
    } else {
      this.saveFavourite();
    }
  }

  saveFavourite(): void {
    const currentUrl = this.realUrl();
    if (!currentUrl) return;

    try {
      const rawFavourites = localStorage.getItem('favourites');
      const favourites: string[] = rawFavourites ? JSON.parse(rawFavourites) : [];

      if (!favourites.includes(currentUrl)) {
        favourites.push(currentUrl);
        localStorage.setItem('favourites', JSON.stringify(favourites));
      }
    } catch (err) { }
  }
}