import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-users-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './users-layout.component.html',
  styleUrl: './users-layout.component.scss',
})
export class UsersLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly logoUrl = '/assets/LOGO-WEB-IST.webp';
  
  // Acceso al Signal del usuario para mostrar info en el layout
  readonly user = this.authService.user;

  /**
   * Navega a la sección del chat
   */
  goChat() {
    void this.router.navigateByUrl('/chat');
  }

  /**
   * Cierra sesión y redirige al login
   */
  logout() {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}