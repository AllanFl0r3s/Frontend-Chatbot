import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Página pública: también permite recuperarse de un enlace incorrecto sin iniciar sesión.
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {}
