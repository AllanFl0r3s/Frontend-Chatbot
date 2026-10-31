import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Role, RolesApiService } from './roles-api.service';

@Component({
  standalone: true,
  selector: 'app-roles',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit {
  roles = signal<Role[]>([]);
  loading = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  showForm = signal(false);
  editingRoleId = signal<number | null>(null);

  form = {
    nombre: '',
    descripcion: '',
    estado: true,
  };

  constructor(
    private readonly rolesApi: RolesApiService,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadRoles();
    }
  }

  loadRoles(): void {
    this.loading.set(true);
    this.error.set(null);

    this.rolesApi.getRoles().subscribe({
      next: (data) => {
        this.roles.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message || 'No se pudieron cargar los roles',
        );
      },
    });
  }

  newRole(): void {
    this.clearMessages();
    this.editingRoleId.set(null);
    this.form = {
      nombre: '',
      descripcion: '',
      estado: true,
    };
    this.showForm.set(true);
  }

  editRole(role: Role): void {
    this.clearMessages();
    this.editingRoleId.set(role.id);
    this.form = {
      nombre: role.nombre,
      descripcion: role.descripcion || '',
      estado: role.estado,
    };
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingRoleId.set(null);
    this.clearMessages();
    this.form = {
      nombre: '',
      descripcion: '',
      estado: true,
    };
  }

  saveRole(): void {
    this.clearMessages();

    const nombre = this.form.nombre.trim();

    if (!nombre) {
      this.error.set('El nombre del rol es obligatorio');
      return;
    }

    this.saving.set(true);

    const editingId = this.editingRoleId();

    if (editingId) {
      this.rolesApi
        .updateRole(editingId, {
          nombre,
          descripcion: this.form.descripcion.trim() || null,
          estado: this.form.estado,
        })
        .subscribe({
          next: () => {
            this.saving.set(false);
            this.success.set('Rol actualizado correctamente');
            this.showForm.set(false);
            this.loadRoles();
          },
          error: (err) => {
            this.saving.set(false);
            this.error.set(
              err?.error?.message || 'No se pudo actualizar el rol',
            );
          },
        });

      return;
    }

    this.rolesApi
      .createRole({
        nombre,
        descripcion: this.form.descripcion.trim() || null,
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.success.set('Rol creado correctamente');
          this.showForm.set(false);
          this.loadRoles();
        },
        error: (err) => {
          this.saving.set(false);
          this.error.set(err?.error?.message || 'No se pudo crear el rol');
        },
      });
  }

  deleteRole(role: Role): void {
    this.clearMessages();

    const esAdmin =
      role.id === 1 || role.nombre.trim().toLowerCase() === 'administrador';

    if (esAdmin) {
      this.error.set('No se puede eliminar el rol administrador');
      return;
    }

    const confirmar = confirm(`¿Deseas eliminar el rol "${role.nombre}"?`);

    if (!confirmar) {
      return;
    }

    this.rolesApi.deleteRole(role.id).subscribe({
      next: (res) => {
        this.success.set(res?.message || 'Rol eliminado correctamente');
        this.loadRoles();
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'No se pudo eliminar el rol');
      },
    });
  }

  isAdminRole(role: Role): boolean {
    return (
      role.id === 1 ||
      role.nombre.trim().toLowerCase() === 'administrador'
    );
  }

  goToChat(): void {
    this.router.navigate(['/chat']);
  }

  private clearMessages(): void {
    this.error.set(null);
    this.success.set(null);
  }
}