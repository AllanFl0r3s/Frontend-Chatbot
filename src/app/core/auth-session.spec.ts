import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { authInterceptor } from './auth.interceptor';
import { environment } from '../../environments/environment';

describe('Cierre confirmado por servidor y errores de sesión', () => {
  let auth: AuthService;
  let http: HttpTestingController;
  let client: HttpClient;
  const router = { navigateByUrl: jasmine.createSpy('navigateByUrl').and.resolveTo(true) };
  beforeEach(() => {
    localStorage.setItem('manda_token', 'token-sintetico-pruebas');
    localStorage.setItem('manda_user', JSON.stringify({ id: 2, roleId: 2, nombre: 'Fixture' }));
    router.navigateByUrl.calls.reset();
    TestBed.configureTestingModule({ providers: [
      provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting(),
      { provide: Router, useValue: router },
    ] });
    auth = TestBed.inject(AuthService); http = TestBed.inject(HttpTestingController);
    client = TestBed.inject(HttpClient);
  });
  afterEach(() => { http.verify(); localStorage.removeItem('manda_token'); localStorage.removeItem('manda_user'); });

  it('conserva el token hasta recibir 204 y luego limpia datos y señal', () => {
    let completed = false;
    auth.logout().subscribe(() => { completed = true; });
    const request = http.expectOne(`${environment.apiUrl}/auth/logout`);
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.get('Authorization')).toBe('Bearer token-sintetico-pruebas');
    expect(auth.token).toBe('token-sintetico-pruebas');
    expect(auth.loggingOut()).toBeTrue();
    request.flush(null, { status: 204, statusText: 'No Content' });
    expect(completed).toBeTrue(); expect(auth.token).toBeNull();
    expect(auth.user()).toBeNull(); expect(auth.loggingOut()).toBeFalse();
  });
  it('503 muestra error, conserva la sesión y permite reintentar', () => {
    auth.logout().subscribe({ error: () => {} });
    http.expectOne(`${environment.apiUrl}/auth/logout`).flush({}, { status: 503, statusText: 'Unavailable' });
    expect(auth.token).toBeTruthy(); expect(auth.logoutError()).toContain('No se pudo confirmar');
    expect(auth.loggingOut()).toBeFalse();
    auth.logout().subscribe();
    http.expectOne(`${environment.apiUrl}/auth/logout`).flush(null, { status: 204, statusText: 'No Content' });
    expect(auth.token).toBeNull(); expect(auth.logoutError()).toBe('');
  });
  it('401 de logout limpia una sesión que ya era inválida', () => {
    let completed = false;
    auth.logout().subscribe(() => { completed = true; });
    http.expectOne(`${environment.apiUrl}/auth/logout`).flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(completed).toBeTrue(); expect(auth.token).toBeNull(); expect(auth.logoutError()).toBe('');
  });
  it('falla de red conserva token y muestra el error', () => {
    auth.logout().subscribe({ error: () => {} });
    http.expectOne(`${environment.apiUrl}/auth/logout`).error(new ProgressEvent('error'));
    expect(auth.token).toBeTruthy(); expect(auth.logoutError()).not.toBe('');
  });
  it('evita dos solicitudes por doble clic', () => {
    auth.logout().subscribe(); auth.logout().subscribe();
    http.expectOne(`${environment.apiUrl}/auth/logout`).flush(null, { status: 204, statusText: 'No Content' });
    expect(auth.token).toBeNull();
  });
  it('una respuesta tardía de logout no borra una sesión nueva', () => {
    auth.logout().subscribe();
    const request = http.expectOne(`${environment.apiUrl}/auth/logout`);
    localStorage.setItem('manda_token', 'otra-sesion-nueva');
    request.flush(null, { status: 204, statusText: 'No Content' });
    expect(auth.token).toBe('otra-sesion-nueva');
  });
  it('sin token limpia el estado local sin petición de logout', () => {
    localStorage.removeItem('manda_token');
    auth.logout().subscribe(); expect(auth.user()).toBeNull();
    http.expectNone(`${environment.apiUrl}/auth/logout`);
  });
  it('401 de una petición protegida limpia el acceso y redirige al login', () => {
    client.get(`${environment.apiUrl}/users`).subscribe({ error: () => {} });
    http.expectOne(`${environment.apiUrl}/users`).flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(auth.token).toBeNull(); expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
  it('403 de permisos no cierra sesión', () => {
    client.get(`${environment.apiUrl}/users`).subscribe({ error: () => {} });
    http.expectOne(`${environment.apiUrl}/users`).flush({}, { status: 403, statusText: 'Forbidden' });
    expect(auth.token).toBeTruthy(); expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
  it('401 en login o en otro servidor no borra una sesión vigente', () => {
    client.post(`${environment.apiUrl}/auth/login`, {}).subscribe({ error: () => {} });
    http.expectOne(`${environment.apiUrl}/auth/login`).flush({}, { status: 401, statusText: 'Unauthorized' });
    client.get('https://example.invalid/unrelated').subscribe({ error: () => {} });
    http.expectOne('https://example.invalid/unrelated').flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(auth.token).toBeTruthy(); expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
  it('401 tardío de otra sesión no borra la actual', () => {
    client.get(`${environment.apiUrl}/users`).subscribe({ error: () => {} });
    const request = http.expectOne(`${environment.apiUrl}/users`);
    localStorage.setItem('manda_token', 'otra-sesion-nueva');
    request.flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(auth.token).toBe('otra-sesion-nueva'); expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
  it('no envía JWT a direcciones que solo comparten el prefijo de la API', () => {
    const url = `${environment.apiUrl}.example.invalid/resource`;
    client.get(url).subscribe({ error: () => {} });
    const request = http.expectOne(url);
    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(auth.token).toBeTruthy(); expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
