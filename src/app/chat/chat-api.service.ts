import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type ChatReply = { 
  reply: string;
  followUp?: string;
};

@Injectable({ providedIn: 'root' })
export class ChatApiService {
  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<ChatReply> {
    return this.http.post<ChatReply>(
      `${environment.apiUrl}/chat/message`,
      { message }
    );
  }

  getPerfil() {
  return this.http.get<any>(`${environment.apiUrl}/perfil`);
}

updatePerfil(data: any) {
  return this.http.put<any>(`${environment.apiUrl}/perfil`, data);
}
}

