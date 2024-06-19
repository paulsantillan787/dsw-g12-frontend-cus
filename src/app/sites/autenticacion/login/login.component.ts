import { Component, Inject, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Persona } from '../../../core/models/persona';
import { PersonaService } from '../../../core/services/persona.service';
import { Usuario } from '../../../core/models/usuario';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Paciente } from '../../../core/models/paciente';
import { PacienteService } from '../../../core/services/paciente.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule, NgxPaginationModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user: String | null = '';
  loginForm: FormGroup; // Use the non-null assertion operator here
  registerPacienteForm: FormGroup;

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private router: Router,
    private personaService: PersonaService,
    private usuarioService: UsuarioService,
    private pacienteService: PacienteService,
    private modalService: NgbModal,
  ) {
    this.user = localStorage.getItem('user');

    this.loginForm = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });

    this.registerPacienteForm = new FormGroup({
      //modelo persona
      documento: new FormControl('', [Validators.required]),
      tipo_documento: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      apellido_paterno: new FormControl('', [Validators.required]),
      apellido_materno: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      fecha_nacimiento: new FormControl('', [Validators.required]),
      sexo: new FormControl('', [Validators.required]),
      //modelo usuario
      correo: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      //modelo paciente
      //...
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.usuarioService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.access_token);
          this.router.navigate(['/home']);
          Swal.fire({
            icon: 'success',
            title: 'Bienvenido',
            text: res.message,
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error.message,
          });
        }
      });
    }
  }
}
