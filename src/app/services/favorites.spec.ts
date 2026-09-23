import { FavoritesService } from './favorites';
import { Photo } from '../models/photo';

describe('FavoritesService', () => {
  const photoA: Photo = { id: 'a', url: 'https://picsum.photos/seed/a/200/300' };
  const photoB: Photo = { id: 'b', url: 'https://picsum.photos/seed/b/200/300' };

  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty when nothing is saved yet', () => {
    const service = new FavoritesService();
    expect(service.favorites()).toEqual([]);
  });

  it('adds a photo to favorites', () => {
    const service = new FavoritesService();

    service.add(photoA);

    expect(service.favorites()).toEqual([photoA]);
    expect(service.isFavorite('a')).toBe(true);
  });

  it('does not add the same photo twice', () => {
    const service = new FavoritesService();

    service.add(photoA);
    service.add(photoA);

    expect(service.favorites()).toHaveLength(1);
  });

  it('removes a photo from favorites', () => {
    const service = new FavoritesService();
    service.add(photoA);
    service.add(photoB);

    service.remove('a');

    expect(service.favorites()).toEqual([photoB]);
    expect(service.isFavorite('a')).toBe(false);
  });

  it('persists favorites to localStorage on every change', () => {
    const service = new FavoritesService();

    service.add(photoA);

    expect(JSON.parse(localStorage.getItem('favorites')!)).toEqual([photoA]);
  });

  it('restores favorites saved by a previous session (survives a page refresh)', () => {
    localStorage.setItem('favorites', JSON.stringify([photoA]));

    const service = new FavoritesService();

    expect(service.favorites()).toEqual([photoA]);
  });

  it('finds a favorite by id', () => {
    const service = new FavoritesService();
    service.add(photoA);

    expect(service.getById('a')).toEqual(photoA);
    expect(service.getById('missing')).toBeUndefined();
  });
});
