import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { adminGuard } from './core/admin.guard';

export const routes: Routes = [
  // Redirección inicial
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  // Ruta Pública
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login.component').then((m) => m.LoginComponent),
  },

  // Usuarios autenticados
  {
    path: 'chat',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./chat/chat.component').then((m) => m.ChatComponent),
  },

  // Administración de usuarios
  {
    path: 'users',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./users/users-layout.component').then(
        (m) => m.UsersLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./users/users-list.component').then(
            (m) => m.UsersListComponent,
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./users/user-form.component').then(
            (m) => m.UserFormComponent,
          ),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./users/user-form.component').then(
            (m) => m.UserFormComponent,
          ),
      },
    ],
  },

  // RUTA ROLES

  // SIEMPRE AL FINAL
  { path: '**', redirectTo: 'login' },
];