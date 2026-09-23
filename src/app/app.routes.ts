import { Routes } from '@angular/router';
import { Gallery } from './components/gallery/gallery';
import { Favourites } from './components/favourites/favourites'
import { Photo } from './components/photo/photo';

export const routes: Routes = [
    { path: '', component: Gallery },
    { path: 'favourites', component: Favourites },
    { path: 'photos/:id', component: Photo },
    { path: '**', redirectTo: '' } 
];
