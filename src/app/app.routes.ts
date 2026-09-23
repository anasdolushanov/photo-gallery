import { Routes } from '@angular/router';
import { Gallery } from './components/gallery/gallery';
import { Favorites } from './components/favorites/favorites';
import { Photo } from './components/photo/photo';

export const routes: Routes = [
  { path: '', component: Gallery },
  { path: 'favorites', component: Favorites },
  { path: 'photos/:id', component: Photo },
  { path: '**', redirectTo: '' },
];
