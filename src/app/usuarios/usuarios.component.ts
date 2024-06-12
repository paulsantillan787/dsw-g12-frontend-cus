import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  constructor(private router: Router) { }

  onClick(user: string) {
    let navigationExtras: NavigationExtras = {
      state: {
        user: user
      }
    };
    this.router.navigate(['login'], navigationExtras);
  }
}
