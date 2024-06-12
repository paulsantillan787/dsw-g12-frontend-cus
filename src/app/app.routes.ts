import { Routes } from '@angular/router';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { LoginAlumnoComponent } from './login-alumno/login-alumno.component';
import { LoginEspecialistaComponent } from './login-especialista/login-especialista.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { RealizarTestComponent } from './realizar-test/test.component';
import { HistorialComponent } from './historial/historial.component';

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
  },
  {
    path: 'perfil',
    component: MiPerfilComponent
  },
  {
    path: 'test',
    component: RealizarTestComponent
  },
  {
    path: 'historial',
    component: HistorialComponent
  }
];
