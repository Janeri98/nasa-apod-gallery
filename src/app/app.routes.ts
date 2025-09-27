import { Routes } from '@angular/router';
import { ApodListComponent } from './components/apod-list/apod-list';
import { ApodDetailComponent } from './components/apod-detail/apod-detail';

export const routes: Routes = [
  { path: '', component: ApodListComponent },
  { path: 'apod/:date', component: ApodDetailComponent },
  { path: '**', redirectTo: '' }
];