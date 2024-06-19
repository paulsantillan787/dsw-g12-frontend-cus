import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
    localStorage.setItem('user', user);
    this.router.navigate(['login']);
  }

  return() {
    this.router.navigate(['bienvenida']);
  }
}
