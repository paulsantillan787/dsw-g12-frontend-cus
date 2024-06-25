import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Paciente } from '../../core/models/paciente';
import { PacienteService } from '../../core/services/paciente.service';
import { Especialista } from '../../core/models/especialista';
import { EspecialistaService } from '../../core/services/especialista.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {
  pacientes: Paciente[] = [];
  paciente: Paciente | null = null;
  especialistas: Especialista[] = [];
  especialista: Especialista | null = null;

  isTemplate: boolean = false;

  tipo_usuario: string = localStorage.getItem('user') || '';

  constructor(
    private pacienteService: PacienteService,
    private especialistaService: EspecialistaService,
  ) { }

  ngOnInit(){
    const token = localStorage.getItem('token');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    console.log(payload.sub);

    if (this.tipo_usuario == 'paciente')
      this.pacienteService.getPacientes().subscribe((data: any) => {
        this.pacientes = data.pacientes;
        this.paciente = this.pacientes.find((paciente) => paciente.id_usuario == payload.id_usuario) || null;
        this.isTemplate = true;
      });
    else if (this.tipo_usuario == 'especialista')
      this.especialistaService.getEspecialistas().subscribe((data: any) => {
        this.especialistas = data.especialistas;
        this.especialista = this.especialistas.find((especialista) => especialista.id_usuario == payload.id_usuario) || null;
      });
  }
}
