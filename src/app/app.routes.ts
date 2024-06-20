import { Routes } from '@angular/router';
import { BienvenidaComponent } from './sites/autenticacion/bienvenida/bienvenida.component';
import { UsuariosComponent } from './sites/autenticacion/usuarios/usuarios.component';
import { LoginComponent } from './sites/autenticacion/login/login.component';
import { MainComponent } from './shared/main/main.component';
import { HomeComponent } from './sites/home/home.component';
import { SelectTestComponent } from './sites/select-test/select-test.component';
import { TestsPerformedComponent } from './sites/tests-performed/tests-performed.component';
import { MyProfileComponent } from './sites/my-profile/my-profile.component';
import { VigilanceComponent } from './sites/vigilance/vigilance.component';
import { MapaComponent } from './sites/mapa/mapa.component';

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
        component: MainComponent,
        children: [
            //Sites para pacientes
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'select-test',
                component: SelectTestComponent
            },
            {
                path: 'tests-performed',
                component: TestsPerformedComponent
            },
            {
                path: 'my-profile',
                component: MyProfileComponent
            },
            //Sites para Especialistas
            {
                path: 'vigilance',
                component: VigilanceComponent
            },
            {
                path: 'mapa',
                component: MapaComponent
            },
            
        ]
    }
];
