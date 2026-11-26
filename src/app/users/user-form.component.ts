import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService } from '../core/users.service';
import { User, UserInput } from '../core/models';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly usersService = inject(UsersService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isEdit = false;
  userId: number | null = null;
  isSubmitting = false;
  errorMessage = '';
  loadingUser = false;
  loadFailed = false;
  readonly rutas = Array.from({ length: 10 }, (_, i) => `S${String(i + 1).padStart(2, '0')}`);
  currentRoutes: string[] = [];

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    usuario: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    roleId: [2, [Validators.required, Validators.min(1)]],
    rutaCodigo: [''],
    telefonoNumero: [''],
    estado: [true],
  });

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.userId = idParam ? Number(idParam) : null;
    this.isEdit = !!this.userId;

    this.setPasswordValidators();

    if (this.isEdit && this.userId) {
      this.loadUser(this.userId);
    }
  }

  private loadUser(id: number) {
    this.loadingUser = true;
    this.usersService.getUser(id).subscribe({
      next: (user: User) => {
        this.loadingUser = false;
        this.currentRoutes = user.rutasAsignadas ?? (user.rutaCodigo ? [user.rutaCodigo] : []);
        this.form.patchValue({
          nombre: user.nombre ?? '',
          usuario: user.usuario ?? '',
          email: user.email ?? '',
          roleId: user.roleId ?? 1,
          telefonoNumero: user.telefonoNumero ?? '',
          estado: user.estado,
          rutaCodigo: user.rutaCodigo ?? '',
        });
      },
      error: () => {
        this.loadingUser = false;
        this.loadFailed = true;
        this.errorMessage = 'No se pudo cargar la información del usuario.';
      },
    });
  }

  submit() {
    if (this.isSubmitting || this.loadingUser || this.loadFailed) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    const values = this.form.getRawValue();
    const payload = this.buildPayload(values);

    const request =
      this.isEdit && this.userId
        ? this.usersService.updateUser(this.userId, payload)
        : this.usersService.createUser(payload as UserInput);

    request.subscribe({
      next: () => {
      this.isSubmitting = false;
      alert('Usuario guardado correctamente');
      void this.router.navigate(['/users']);
      },
      error: (error) => {
        this.isSubmitting = false;

        if (error.status === 409) {
          this.errorMessage = 'El correo o nombre de usuario ya existe.';
        } else {
          this.errorMessage = 'Ocurrió un error al guardar el usuario.';
        }
      },
    });
  }

  private setPasswordValidators() {
    const passwordControl = this.form.controls.password;

    if (this.isEdit) {
      passwordControl.setValidators([Validators.minLength(6)]);
    } else {
      passwordControl.setValidators([
        Validators.required,
        Validators.minLength(6),
      ]);
    }

    passwordControl.updateValueAndValidity();
  }

  private buildPayload(values: any): Partial<UserInput> {
    const payload: Partial<UserInput> = {
  nombre: values.nombre.trim(),
  password: values.password?.trim() || undefined,
  roleId: Number(values.roleId),
  telefonoNumero: values.telefonoNumero?.trim() || undefined,
  estado: values.estado,
};
if (!this.isEdit || this.form.controls.rutaCodigo.dirty) {
  payload.rutaCodigo = values.rutaCodigo || null;
}

if (!this.isEdit) {
  payload.usuario = values.usuario.trim().toLowerCase();
  payload.email = values.email.trim().toLowerCase();
}

    return Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined),
    ) as Partial<UserInput>;
  }
}
