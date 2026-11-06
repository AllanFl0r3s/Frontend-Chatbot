import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, defer, EMPTY, finalize, map, of, tap, throwError, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginPayload, RegisterPayload, RegisterResponse, User } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'manda_token';
  private readonly userKey = 'manda_user';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);

  readonly user = signal<User | null>(this.readUser());
  readonly loggingOut = signal(false);
  readonly logoutError = signal('');

  login(payload: LoginPayload) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(
        tap((response) => {
          this.setToken(response.accessToken);
          this.setUser(response.user);
        }),
      );
  }

  register(payload: RegisterPayload) {
    // Sin tap de sesión: registrarse no almacena JWT ni cambia el usuario autenticado.
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/auth/register`, payload);
  }
  forgotPassword(email: string) {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/auth/forgot-password`, { email });
  }
  resetPassword(token: string, password: string) {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/auth/reset-password`, { token, password });
  }
  logout() {
    return defer(() => {
      if (this.loggingOut()) return EMPTY;
      const token = this.token;
      this.logoutError.set('');
      if (!token) { this.clearSession(); return of(undefined); }
      this.loggingOut.set(true);
      // Capturar el token: una respuesta tardía no debe borrar otra sesión recién iniciada.
      return this.http.post<void>(`${environment.apiUrl}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      }).pipe(
        timeout(10000),
        catchError(error => error.status === 401 ? of(undefined) : throwError(() => error)),
        tap(() => this.clearSession(token)),
        map(() => undefined),
        catchError(error => {
          this.logoutError.set('No se pudo confirmar el cierre. Comprueba tu conexión y pulsa Salir otra vez.');
          return throwError(() => error);
        }),
        finalize(() => this.loggingOut.set(false)),
      );
    });
  }

  clearSession(expectedToken: string | null = this.token): boolean {
    if (this.token !== expectedToken) return false;
    this.clearToken(); this.clearUser();
    return true;
  }

  get token(): string | null {
    return this.storage?.getItem(this.tokenKey) ?? null;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private get storage(): Storage | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return window.localStorage;
  }

  private readUser(): User | null {
    const raw = this.storage?.getItem(this.userKey);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  private setUser(user: User) {
    this.storage?.setItem(this.userKey, JSON.stringify(user));
    this.user.set(user);
  }

  private clearUser() {
    this.storage?.removeItem(this.userKey);
    this.user.set(null);
  }

  private setToken(token: string) {
    this.storage?.setItem(this.tokenKey, token);
  }

  private clearToken() {
    this.storage?.removeItem(this.tokenKey);
  }
}
