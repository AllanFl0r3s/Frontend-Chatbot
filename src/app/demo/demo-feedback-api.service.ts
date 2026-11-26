import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
export type FeedbackDraft = { submissionId: string; task: string; outcome: string; ease: number; usefulness: number; comment: string };
export type FeedbackRow = FeedbackDraft & { id: number; createdAt: string };
export type FeedbackReport = { items: FeedbackRow[]; total: number; page: number; pageSize: number; summary: {task: string; total: number; blocked: number; ease: number; usefulness: number}[] };
@Injectable({ providedIn: 'root' })
export class DemoFeedbackApi {
  constructor(private readonly http: HttpClient) {}
  submit(body: FeedbackDraft) { return this.http.post<{id:number; saved:boolean}>(`${environment.apiUrl}/demo-feedback`, body); }
  report(page: number) { return this.http.get<FeedbackReport>(`${environment.apiUrl}/demo-feedback`, {params:{page}}); }
}
