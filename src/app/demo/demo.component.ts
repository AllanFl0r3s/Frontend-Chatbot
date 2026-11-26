import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DemoFeedbackApi } from './demo-feedback-api.service';
import { demoTasks } from './demo-data';

@Component({ standalone: true, imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './demo.component.html', styleUrl: './demo.css' })
export class DemoComponent {
  private readonly api = inject(DemoFeedbackApi);
  private readonly fb = inject(FormBuilder);
  readonly tasks = demoTasks;
  readonly scores = [1, 2, 3, 4, 5];
  readonly pending = signal(false);
  readonly error = signal('');
  readonly saved = signal<number | null>(null);
  private submissionId = '';
  readonly form = this.fb.nonNullable.group({
    task: ['general', Validators.required], outcome: ['', Validators.required],
    ease: [0, [Validators.min(1), Validators.max(5)]],
    usefulness: [0, [Validators.min(1), Validators.max(5)]],
    comment: ['', Validators.maxLength(1000)], consent: [false, Validators.requiredTrue],
  });
  choose(task: string) { if (!this.pending() && !this.saved()) this.form.controls.task.setValue(task); }
  newOpinion() {
    this.submissionId = ''; this.saved.set(null); this.error.set('');
  }
  submit() {
    if (this.pending() || this.saved()) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); this.error.set('Selecciona el resultado, las dos valoraciones y acepta registrar tu opinión.'); return; }
    this.submissionId ||= crypto.randomUUID();
    const {consent, ...value} = this.form.getRawValue();
    this.pending.set(true); this.error.set('');
    this.api.submit({ ...value, submissionId: this.submissionId }).subscribe({
      next: result => { this.pending.set(false); this.saved.set(result.id); },
      error: err => { this.pending.set(false); this.error.set(err?.error?.message || 'No se pudo guardar tu opinión. Conservamos tus respuestas en esta pantalla para reintentar.'); },
    });
  }
}
