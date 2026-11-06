import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.token;

  const apiBase = environment.apiUrl.replace(/\/+$/, '');
  const isApi = req.url === apiBase || req.url.startsWith(`${apiBase}/`);
  const isLogin = req.url.startsWith(`${environment.apiUrl}/auth/login`);

  if (isApi && !isLogin && token && !req.headers.has('Authorization')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(catchError(error => {
    const isPublicAuth = /\/auth\/(login|register|forgot-password|reset-password)(?:$|[?#])/.test(req.url);
    // 403 conserva la sesión: es falta de permisos, no un cierre.
    if (error.status === 401 && isApi && !isPublicAuth
      && auth.clearSession(token)) void router.navigateByUrl('/login');
    return throwError(() => error);
  }));
};
