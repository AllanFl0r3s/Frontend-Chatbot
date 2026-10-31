import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type Role = {
  id: number;
  nombre: string;
  descripcion?: string | null;
  estado: boolean;
  fechaCreacion?: string;
};

export type CreateRoleDto = {
  nombre: string;
  descripcion?: string | null;
};

export type UpdateRoleDto = {
  nombre?: string;
  descripcion?: string | null;
  estado?: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class RolesApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles`);
  }

  createRole(data: CreateRoleDto): Observable<Role> {
    return this.http.post<Role>(`${this.apiUrl}/roles`, data);
  }

  updateRole(id: number, data: UpdateRoleDto): Observable<Role> {
    return this.http.patch<Role>(`${this.apiUrl}/roles/${id}`, data);
  }

  deleteRole(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/roles/${id}`);
  }
}
