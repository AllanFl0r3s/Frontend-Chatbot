import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, OnDestroy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { environment } from '../../environments/environment';

@Component({
  standalone: true, selector: 'app-password-recovery',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './password-recovery.component.html', styleUrl: './register.component.scss',
})
export class PasswordRecoveryComponent implements OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly platform = inject(PLATFORM_ID);
  private readonly fb = inject(FormBuilder);
  private request?: Subscription;
  private token = '';
  readonly reset = this.route.snapshot.data['reset'] === true;
  readonly preview = environment.visualPreview;
  readonly pending = signal(false);
  readonly done = signal(false);
  readonly error = signal('');
  readonly form = this.fb.nonNullable.group({ email: [''], password: [''], confirmation: [''] });

  constructor() {
    if (this.reset) {
      this.form.controls.password.setValidators([Validators.required, Validators.minLength(12)]);
      this.form.controls.confirmation.setValidators([Validators.required]);
      if (isPlatformBrowser(this.platform)) {
        this.token = new URLSearchParams(window.location.hash.slice(1)).get('token') ?? '';
        // Retirar el secreto del historial visible; conservarlo solo en memoria de esta pantalla.
        window.history.replaceState(window.history.state, '', window.location.pathname);
        if (!this.token) this.error.set('Falta el enlace de recuperación. Solicita uno nuevo.');
      }
    } else this.form.controls.email.setValidators([Validators.required, Validators.email, Validators.maxLength(150)]);
    for (const control of Object.values(this.form.controls)) control.updateValueAndValidity();
    if (this.preview) this.form.disable();
  }

  submit() {
    if (this.preview || this.pending() || this.done()) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) { this.error.set('Revisa los campos del formulario.'); return; }
    const { email, password, confirmation } = this.form.getRawValue();
    if (this.reset && (!this.token || password !== confirmation || new TextEncoder().encode(password).length > 72)) {
      this.error.set('Comprueba el enlace y que las contraseñas coincidan (máximo 72 bytes UTF-8).'); return;
    }
    this.pending.set(true); this.error.set('');
    const operation = this.reset ? this.auth.resetPassword(this.token, password)
      : this.auth.forgotPassword(email.trim().toLowerCase());
    this.request = operation.subscribe({
      next: () => {
        if (this.reset) this.auth.clearSession();
        this.done.set(true); this.pending.set(false); this.form.reset(); this.token = '';
      },
      error: (failure: HttpErrorResponse) => {
        const messages: Record<number, string> = {
          0: 'No se pudo conectar con el backend.',
          400: this.reset ? 'El enlace venció, ya se utilizó o es inválido; usa una contraseña distinta de la anterior o solicita otro enlace.' : 'Revisa el correo ingresado.',
          429: 'Demasiados intentos. Espera 15 minutos.',
          503: 'La recuperación por correo no está disponible. Intenta más tarde.',
        };
        this.error.set(messages[failure.status] ?? 'No se pudo completar la operación. Intenta más tarde.');
        this.pending.set(false);
      },
    });
  }
  ngOnDestroy() { this.request?.unsubscribe(); this.token = ''; }
}
