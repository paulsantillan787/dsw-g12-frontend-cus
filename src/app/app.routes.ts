import { Routes } from '@angular/router';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { LoginAlumnoComponent } from './login-alumno/login-alumno.component';
import { LoginEspecialistaComponent } from './login-especialista/login-especialista.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: BienvenidaComponent
  },
  {
    path: 'usuarios',
    component: UsuariosComponent
  },
  {
    path: 'login-alumno',
    component: LoginAlumnoComponent
  },
  {
    path: 'login-especialista',
    component: LoginEspecialistaComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];
