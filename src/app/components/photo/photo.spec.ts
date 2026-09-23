import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { Photo } from './photo';
import { FavoritesService } from '../../services/favorites';
import { Photo as PhotoModel } from '../../models/photo';

describe('Photo', () => {
  let fixture: ComponentFixture<Photo>;
  let component: Photo;
  let router: Router;
  let favoritesService: { getById: ReturnType<typeof vi.fn>; remove: ReturnType<typeof vi.fn> };
  const photo: PhotoModel = { id: 'abc', url: 'https://picsum.photos/seed/abc/200/300' };

  beforeEach(async () => {
    favoritesService = {
      getById: vi.fn().mockReturnValue(photo),
      remove: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Photo],
      providers: [provideRouter([]), { provide: FavoritesService, useValue: favoritesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Photo);
    fixture.componentRef.setInput('id', photo.id);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('shows the favorited photo for the given id', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.src).toBe(photo.url);
    expect(favoritesService.getById).toHaveBeenCalledWith(photo.id);
  });

  it('shows a not-found message when the photo is not in favorites', async () => {
    favoritesService.getById.mockReturnValue(undefined);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.not-found')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('img')).toBeFalsy();
  });

  it('removes the photo from favorites and navigates back to the favorites list', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    fixture.detectChanges();
    await fixture.whenStable();

    component.removeFromFavorites();

    expect(favoritesService.remove).toHaveBeenCalledWith(photo.id);
    expect(navigateSpy).toHaveBeenCalledWith(['/favorites']);
  });
});
