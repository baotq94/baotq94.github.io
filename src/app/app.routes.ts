import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', title: 'baotq94', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'blog', title: 'Blog · baotq94', loadComponent: () => import('./pages/blog/blog').then((m) => m.Blog) },
  {
    path: 'investment',
    title: 'Investment · baotq94',
    loadComponent: () => import('./pages/investment/investment').then((m) => m.Investment),
  },
  { path: 'books', title: 'Books · baotq94', loadComponent: () => import('./pages/books/books').then((m) => m.Books) },
  { path: '**', redirectTo: '' },
];
