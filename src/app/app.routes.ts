import { Routes } from '@angular/router';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { RealizarTestComponent } from './realizar-test/test.component';
import { HistorialComponent } from './historial/historial.component';
import { HorarioComponent } from './horario/horario.component';
import { PacientesComponent } from './pacientes/pacientes.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';

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
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
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
      },  
      {
        path: 'horario',
        component: HorarioComponent
      },
      {
        path: 'pacientes',
        component: PacientesComponent
      }
      // Otras rutas que necesiten el navbar y footer
    ]
  }
];
