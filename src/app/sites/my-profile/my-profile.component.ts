import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Persona } from '../../core/models/persona';
import { PersonaService } from '../../core/services/persona.service';
import { Usuario }  from '../../core/models/usuario';
import { UsuarioService } from '../../core/services/usuario.service';
import { Paciente } from '../../core/models/paciente';
import { PacienteService } from '../../core/services/paciente.service';
import { Ubigeo } from '../../core/models/ubigeo';
import { UbigeoService } from '../../core/services/ubigeo.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {
  personas: Persona[] = [];
  persona: Persona | null = null;
  usuarios: Usuario[] = [];
  usuario: Usuario | null = null;
  pacientes: Paciente[] = [];
  paciente: Paciente | null = null;
  ubigeos: Ubigeo[] = [];
  ubigeo: Ubigeo | null = null;

  constructor(
    private personaService: PersonaService,
    private usuarioService: UsuarioService,
    private pacienteService: PacienteService,
    private ubigeoService: UbigeoService
  ) { }

  ngOnInit(){
    const token = localStorage.getItem('token');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    console.log(payload.sub);

    this.personaService.getPersonas().subscribe((data: any) => {
      this.personas = data.personas;
      this.persona = this.personas.find((persona) => persona.documento == payload.sub) || null;
      console.log(this.persona);
    });

    this.ubigeoService.getUbigeos().subscribe((data: any) => {
      this.ubigeos = data.ubigeos;
      this.ubigeo = this.ubigeos.find((ubigeo) => ubigeo.id_ubigeo == this.persona?.id_ubigeo) || null;
      console.log(this.ubigeo);
    });

    this.usuarioService.getUsuarios().subscribe((data: any) => {
      this.usuarios = data.usuarios;
      this.usuario = this.usuarios.find((usuario) => usuario.documento == this.persona?.documento) || null;
      console.log(this.usuario);
    });

    this.pacienteService.getPacientes().subscribe((data: any) => {
      this.pacientes = data.pacientes;
      this.paciente = this.pacientes.find((paciente) => paciente.id_usuario == this.usuario?.id_usuario) || null;
      console.log(this.paciente);
    });
  }
}
