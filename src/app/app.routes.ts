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

  // Registro público: el backend fija el rol y valida todos los datos.
  {
    path: 'register',
    title: 'Crear cuenta | Chatbot',
    loadComponent: () => import('./auth/register.component').then(m => m.RegisterComponent),
  },
  // Usuarios autenticados
  {
    path: 'chat',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./chat/chat.component').then((m) => m.ChatComponent),
  },

  // Consulta estructurada: usa el mismo JWT que el chat; el backend valida el acceso a rutas.
  {
    path: 'visits',
    canActivate: [authGuard],
    title: 'Consulta de visitas | Chatbot',
    loadComponent: () => import('./visits/visits.component').then((m) => m.VisitsComponent),
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

  // Siempre al final: solo captura direcciones que no coinciden con las rutas anteriores.
  {
    path: '**',
    title: 'Página no encontrada | Chatbot',
    loadComponent: () =>
      import('./not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
