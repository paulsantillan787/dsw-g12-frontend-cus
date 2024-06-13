import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { Usuario } from '../models/usuario';
import { UsuariosService } from '../services/usuarios.service';
import { Estudiante } from '../models/estudiante';
import { EstudianteService } from '../services/estudiante.service';
import { Especialista } from '../models/especialista';
import { EspecialistaService } from '../services/especialista.service';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  estudiante: Estudiante | null = null;
  especialista: Especialista | null = null;
  user: String = localStorage.getItem('user') || '';

  constructor(private usuariosService: UsuariosService,
              private estudianteService: EstudianteService,
              private especialistaService: EspecialistaService,
  ) {}

  ngOnInit() {
    this.usuariosService.getUsuarios().subscribe(
      (response: any) => {
        const usuarios = response.usuarios;
        // Obtener el token y decodificarlo
        const token = localStorage.getItem('token');
        const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
        // Filtrar para encontrar el usuario específico
        this.usuario = usuarios.find((usuario: Usuario) => usuario.documento === payload?.sub) || null;
        console.log(this.usuario);
      },
      error => {
        console.error(error);
      }
    );
    this.estudianteService.getEstudiantes().subscribe(
      (response: any) => {
        const estudiantes = response.estudiantes;
        this.estudiante = estudiantes.find((estudiante: Estudiante) => estudiante.documento === this.usuario?.documento) || null;
        console.log(this.estudiante);
      },
      error => {
        console.error(error);
      }
    );
    this.especialistaService.getEspecialistas().subscribe(
      (response: any) => {
        const especialistas = response.especialistas;
        this.especialista = especialistas.find((especialista: Especialista) => especialista.documento === this.usuario?.documento) || null;
        console.log(this.especialista);
      },
      error => {
        console.error(error);
      }
    );
  }
}
