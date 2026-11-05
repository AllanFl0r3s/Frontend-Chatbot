import { CommonModule } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { VisitsApiService, VisitsFilters, VisitsResponse } from './visits-api.service';

@Component({
  selector: 'app-visits',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './visits.component.html',
  styleUrl: './visits.component.scss',
})
export class VisitsComponent implements OnDestroy {
  // Fecha fija de la semilla académica; no presupone que hay visitas hoy.
  route = 'S08';
  date = '2026-11-05';
  pageSize = 5;
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly result = signal<VisitsResponse | null>(null);
  private activeRequest?: Subscription;
  private submittedFilters?: VisitsFilters;

  constructor(private readonly api: VisitsApiService) {}

  consult() {
    if (this.loading()) return;
    this.submittedFilters = { route: this.route.trim().toUpperCase(), date: this.date,
      pageSize: Number(this.pageSize) };
    this.route = this.submittedFilters.route;
    this.loadPage(1);
  }

  changePage(page: number) {
    if (!this.loading() && page > 0 && this.submittedFilters) this.loadPage(page);
  }

  private loadPage(page: number) {
    if (!this.submittedFilters) return;
    this.error.set(null);
    // Se retiran los resultados anteriores: un fallo nuevo nunca debe mostrar cifras viejas.
    this.result.set(null);
    if (environment.visualPreview) {
      this.error.set('Esta vista previa no está conectada al backend. Prueba las consultas en el entorno local.');
      return;
    }
    this.activeRequest?.unsubscribe();
    this.loading.set(true);
    this.activeRequest = this.api.listClients(this.submittedFilters, page).subscribe({
      next: (response) => { this.result.set(response); this.loading.set(false); },
      error: (failure: HttpErrorResponse) => {
        const messages: Record<number, string> = {
          0: 'No se pudo conectar al backend. Comprueba que esté iniciado en el puerto 3021.',
          400: 'Revisa la ruta, la fecha y el tamaño de página.',
          401: 'Tu sesión no es válida o venció. Vuelve a iniciar sesión.',
          403: 'Tu cuenta no tiene acceso a esa ruta.',
          503: 'No fue posible consultar las visitas. Revisa el backend y vuelve a intentarlo.',
        };
        this.error.set(messages[failure.status] ?? 'Ocurrió un error al consultar. Vuelve a intentarlo.');
        this.loading.set(false);
      },
    });
  }

  ngOnDestroy() { this.activeRequest?.unsubscribe(); }
}
