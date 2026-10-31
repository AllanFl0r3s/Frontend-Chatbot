import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly logoUrl = '/assets/LOGO-WEB-IST.webp';

  readonly form = this.fb.nonNullable.group({
    identifier: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  errorMessage = '';
  isSubmitting = false;
  showPassword = false;

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;
    this.cdr.detectChanges();

    const { identifier, password } = this.form.getRawValue();

    this.authService.login({ identifier, password }).subscribe({
      next: (res) => {
        this.isSubmitting = false;

        localStorage.setItem('manda_token', res.accessToken);
        localStorage.setItem('manda_user', JSON.stringify(res.user));

        const roleId =
          (res.user as any)?.roleId ??
          (res.user as any)?.Id_Rol ??
          (res.user as any)?.idRol ??
          (res.user as any)?.rolId;

        const isAdmin = Number(roleId) === 1;

        this.cdr.detectChanges();

        void this.router.navigateByUrl(isAdmin ? '/users' : '/chat');
      },

      error: (error) => {
        this.isSubmitting = false;

        if (error.status === 401) {
          this.errorMessage = 'Usuario o contraseña incorrectos';
        } else if (error.status === 403) {
          this.errorMessage = 'Usuario inactivo';
        } else {
          this.errorMessage = 'Error al conectar con el servidor';
        }

        this.cdr.detectChanges();

        console.error('Login error:', error);
      },
    });
  }
}