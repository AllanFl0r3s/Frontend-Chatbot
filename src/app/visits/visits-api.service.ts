import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

export type VisitsFilters = { route: string; date: string; pageSize: number };
export type VisitsResponse = {
  route: string;
  date: string;
  totalClients: number;
  totalVisitRecords: number;
  clients: { clientCode: string; visitRecords: number }[];
  pagination: { page: number; pageSize: number; totalPages: number; hasNextPage: boolean };
  queriedAt: string;
  description: string;
};

@Injectable({ providedIn: 'root' })
export class VisitsApiService {
  constructor(private readonly http: HttpClient) {}

  listClients(filters: VisitsFilters, page: number) {
    const params = new HttpParams().set('route', filters.route).set('date', filters.date)
      .set('pageSize', filters.pageSize).set('page', page);
    // El interceptor existente agrega el JWT. La contraseña SQL nunca llega al navegador.
    return this.http.get<VisitsResponse>(`${environment.apiUrl}/visits/clients`, { params });
  }
}
