import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User, UserInput } from './models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users`;

  getUsers() {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUser(id: number) {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  createUser(payload: UserInput) {
    return this.http.post<User>(this.baseUrl, payload);
  }

  updateUser(id: number, payload: Partial<UserInput>) {
    return this.http.patch<User>(`${this.baseUrl}/${id}`, payload);
  }

  deleteUser(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
