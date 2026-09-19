import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'baotq94',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'blog',
    title: 'Blog · baotq94',
    loadComponent: () => import('./pages/blog/blog').then((m) => m.Blog),
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./pages/post/post').then((m) => m.PostPage),
  },
  {
    path: 'books',
    title: 'Books · baotq94',
    loadComponent: () => import('./pages/books/books').then((m) => m.Books),
  },
  {
    path: 'type-test',
    title: 'Type test · baotq94',
    loadComponent: () => import('./pages/type-test/type-test').then((m) => m.TypeTest),
  },
  { path: '**', redirectTo: '' },
];
