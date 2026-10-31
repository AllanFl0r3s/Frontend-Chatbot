import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginPayload, User } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'manda_token';
  private readonly userKey = 'manda_user';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);

  readonly user = signal<User | null>(this.readUser());

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

  logout() {
    this.clearToken();
    this.clearUser();
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
