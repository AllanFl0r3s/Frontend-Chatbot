import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersService } from '../core/users.service';
//import { RolesService } from '../core/roles.service';
import { User } from '../core/models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit {
  readonly users = signal<User[]>([]);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  searchTerm = signal('');
  selectedRole = signal('');
  page = signal(1);
  pageSize = 10;
  
  // Define la propiedad aquí junto a los otros estados
  rolesById: Record<number, string> = {};

  // Inyectar RolesService en el constructor
  constructor(
    private readonly usersService: UsersService,
    //private readonly rolesService: RolesService 
  ) {}

  ngOnInit() {
    this.loadUsers();
    //this.loadRoles(); // Llama a la carga de roles
  }

  // método para gestionar la suscripción de roles
  /*loadRoles() {
    this.rolesService.getRoles().subscribe({
      next: (roles) => {
        this.rolesById = Object.fromEntries(roles.map(r => [r.id, r.nombre]));
      }
    });
  }*/

  loadUsers() {
    this.loading.set(true);
    this.error.set(null);

    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de usuarios.');
        this.loading.set(false);
      },
    });
  }

  deleteUser(user: User) {
    const confirmed = window.confirm(
      `¿Eliminar al usuario ${user.nombre}? Esta acción no se puede deshacer.`,
    );
    if (!confirmed) {
      return;
    }

    this.usersService.deleteUser(user.id).subscribe({
      next: () => this.loadUsers(),
      error: () =>
        this.error.set('No se pudo eliminar el usuario. Intenta de nuevo.'),
    });
  }

  filteredUsers() {
  const term = this.searchTerm().trim().toLowerCase();
  const role = this.selectedRole();

  return this.users().filter((user) => {
    const matchText =
    user.nombre?.toLowerCase().includes(term) ||
    user.usuario?.toLowerCase().includes(term) ||
    user.email?.toLowerCase().includes(term) ||
    user.telefonoNumero?.toLowerCase().includes(term);

    const matchRole = !role || user.roleName === role;

    return matchText && matchRole;
  });
}

paginatedUsers() {
  const start = (this.page() - 1) * this.pageSize;
  return this.filteredUsers().slice(start, start + this.pageSize);
}

totalPages() {
  return Math.max(1, Math.ceil(this.filteredUsers().length / this.pageSize));
}

nextPage() {
  if (this.page() < this.totalPages()) {
    this.page.update((p) => p + 1);
  }
}

prevPage() {
  if (this.page() > 1) {
    this.page.update((p) => p - 1);
  }
}

resetPage() {
  this.page.set(1);
}

rolesDisponibles() {
  return Array.from(
    new Set(
      this.users()
        .map((u) => u.roleName)
        .filter(Boolean),
    ),
  );
}
}