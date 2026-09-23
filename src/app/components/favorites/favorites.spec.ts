import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { signal } from '@angular/core';

import { Favorites } from './favorites';
import { FavoritesService } from '../../services/favorites';
import { Photo } from '../../models/photo';

describe('Favorites', () => {
  let fixture: ComponentFixture<Favorites>;
  let component: Favorites;
  const photo: Photo = { id: 'abc', url: 'https://picsum.photos/seed/abc/200/300' };

  async function setup(initialFavorites: Photo[]): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [Favorites],
      providers: [
        provideRouter([]),
        { provide: FavoritesService, useValue: { favorites: signal(initialFavorites).asReadonly() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Favorites);
    component = fixture.componentInstance;
  }

  it('shows an empty state message when there are no favorites', async () => {
    await setup([]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.empty')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('app-image')).toHaveLength(0);
  });

  it('renders every favorite photo', async () => {
    await setup([photo]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('app-image')).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('.empty')).toBeFalsy();
  });

  it('navigates to the single photo page when a favorite is clicked', async () => {
    await setup([photo]);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.openPhoto(photo.id);

    expect(navigateSpy).toHaveBeenCalledWith(['/photos', photo.id]);
  });
});
