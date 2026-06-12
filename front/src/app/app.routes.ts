import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.RegisterPage),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then((m) => m.ProfilePage),
    canActivate: [authGuard],
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products').then((m) => m.ProductsPage),
    canActivate: [authGuard],
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./pages/product-detail/product-detail').then((m) => m.ProductDetailPage),
    canActivate: [authGuard],
  },
  {
    path: 'categories',
    loadComponent: () => import('./pages/categories/categories').then((m) => m.CategoriesPage),
    canActivate: [authGuard],
  },
  {
    path: 'admin/users',
    loadComponent: () => import('./pages/admin-users/admin-users').then((m) => m.AdminUsersPage),
    canActivate: [authGuard, adminGuard],
  },
];
