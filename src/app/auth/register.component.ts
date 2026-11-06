import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { environment } from '../../environments/environment';

const passwordSize: ValidatorFn = control => typeof control.value === 'string'
  && new TextEncoder().encode(control.value).length > 72 ? { passwordSize: true } : null;
const matchingPasswords: ValidatorFn = (control: AbstractControl) => {
  const password = control.get('password')?.value;
  const confirmation = control.get('confirmPassword')?.value;
  return password && confirmation && password !== confirmation ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private activeRequest?: Subscription;
  readonly isVisualPreview = environment.visualPreview;
  readonly submitting = signal(false);
  readonly created = signal(false);
  readonly error = signal<string | null>(null);
  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    usuario: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9][A-Za-z0-9._-]{2,49}$/)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    password: ['', [Validators.required, Validators.minLength(12), passwordSize]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: matchingPasswords });

  constructor() { if (this.isVisualPreview) this.form.disable(); }

  submit() {
    if (this.isVisualPreview || this.submitting() || this.created()) return;
    const values = this.form.getRawValue();
    this.form.patchValue({ nombre: values.nombre.trim(), usuario: values.usuario.trim().toLowerCase(),
      email: values.email.trim().toLowerCase() });
    this.error.set(null);
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const { nombre, usuario, email, password } = this.form.getRawValue();
    this.submitting.set(true);
    // No se envía confirmación ni privilegios. Crear cuenta no inicia sesión automáticamente.
    this.activeRequest = this.auth.register({ nombre, usuario, email, password }).subscribe({
      next: () => {
        this.form.reset();
        this.created.set(true);
        this.submitting.set(false);
      },
      error: (failure: HttpErrorResponse) => {
        const messages: Record<number, string> = {
          0: 'No se pudo conectar al servidor. Comprueba que el backend esté iniciado.',
          400: 'Revisa los datos del formulario.',
          409: 'El correo o usuario no está disponible. Prueba con otro.',
          429: 'Hubo demasiados intentos. Espera un momento y vuelve a intentarlo.',
          503: 'El registro no está disponible en este momento. Intenta más tarde.',
        };
        this.error.set(messages[failure.status] ?? 'No fue posible crear la cuenta. Intenta más tarde.');
        this.submitting.set(false);
      },
    });
  }

  invalid(name: 'nombre' | 'usuario' | 'email' | 'password' | 'confirmPassword') {
    const control = this.form.controls[name];
    return control.touched && control.invalid;
  }

  ngOnDestroy() { this.activeRequest?.unsubscribe(); }
}
