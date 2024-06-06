import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'bienvenida',
    loadComponent: () => import('./bienvenida/bienvenida.component').then(m => m.BienvenidaComponent)
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./usuarios/usuarios.component').then(m => m.UsuariosComponent)
  },
  {
    path: 'login-alumno',
    loadComponent: () => import('./login-alumno/login-alumno.component').then(m => m.LoginAlumnoComponent)
  },
  {
    path: 'login-especialista',
    loadComponent: () => import('./login-especialista/login-especialista.component').then(m => m.LoginEspecialistaComponent)
  }
];
