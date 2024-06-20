import { Component, Inject, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';
import { Router, NavigationStart } from '@angular/router';
import { Persona } from '../../../core/models/persona';
import { PersonaService } from '../../../core/services/persona.service';
import { Usuario } from '../../../core/models/usuario';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Paciente } from '../../../core/models/paciente';
import { PacienteService } from '../../../core/services/paciente.service';
import { Ubigeo } from '../../../core/models/ubigeo';
import { UbigeoService } from '../../../core/services/ubigeo.service';
import { Especialista } from '../../../core/models/especialista';
import { EspecialistaService } from '../../../core/services/especialista.service';

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
  registrarEspecialistaForm: FormGroup;
  ubigeos: Ubigeo[] = [];
  ubigeo: Ubigeo | null = null;
  departamentos: string[] = [];
  departamento: string = '';
  provincias: string[] = [];
  provincia: string = '';
  distritos: string[] = [];
  distrito: string = '';
  checkpass: boolean = true;
  modalRef?: NgbModalRef | null = null;

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private router: Router,
    private personaService: PersonaService,
    private usuarioService: UsuarioService,
    private pacienteService: PacienteService,
    private modalService: NgbModal,
    private ubigeoService: UbigeoService,
    private especialistaService: EspecialistaService
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
      departamento: new FormControl('', [Validators.required]),
      provincia: new FormControl('', [Validators.required]),
      distrito: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      fecha_nacimiento: new FormControl('', [Validators.required]),
      sexo: new FormControl('', [Validators.required]),
      //modelo usuario
      correo: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirm_password: new FormControl('', [Validators.required]),
      //modelo paciente
      //...
    });

    this.registrarEspecialistaForm = new FormGroup({
      //modelo persona
      documento: new FormControl('', [Validators.required]),
      tipo_documento: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      apellido_paterno: new FormControl('', [Validators.required]),
      apellido_materno: new FormControl('', [Validators.required]),
      departamento: new FormControl('', [Validators.required]),
      provincia: new FormControl('', [Validators.required]),
      distrito: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      fecha_nacimiento: new FormControl('', [Validators.required]),
      sexo: new FormControl('', [Validators.required]),
      //modelo usuario
      correo: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirm_password: new FormControl('', [Validators.required]),
      // modelo especialista
      licencia: new FormControl('', [Validators.required]),
      especialidad: new FormControl('', [Validators.required]),
    });

  }

  obtenerDepartamentos(form: FormGroup) {
    this.ubigeoService.getUbigeos().subscribe((data: any) => {
      this.ubigeos = data.ubigeos;
      this.departamentos = [...new Set(this.ubigeos.map(ubigeo => ubigeo.departamento))];
      console.log(this.departamento);
      form.get('departamento')?.valueChanges.subscribe(() => {
        form.get('provincia')?.reset();
        form.get('distrito')?.reset();
      });
      this.provincia = '';
      this.distrito = '';
    });
  }

  obtenerProvincias(departamento: string, form: FormGroup) {
      this.provincias = [...new Set(this.ubigeos.filter(ubigeo => ubigeo.departamento === departamento).map(ubigeo => ubigeo.provincia))];
      console.log(this.provincias);
      form.get('provincia')?.valueChanges.subscribe(() => {
        form.get('distrito')?.reset();
      });
      this.distrito = '';
      this.distritos = [];
  }

  obtenerDistritos(departamento: string, provincia: string) {
    if (departamento != null && provincia != null)
      this.distritos = [...new Set(this.ubigeos.filter(ubigeo => ubigeo.departamento === departamento && ubigeo.provincia === provincia).map(ubigeo => ubigeo.distrito))];
      console.log(this.distritos);
  }

  checkPasswords() {
    if (this.registerPacienteForm.value.password === this.registerPacienteForm.value.confirm_password) {
      this.checkpass = true;
    } else {
      this.checkpass = false;
    }
  }

  register() {
    if (this.registerPacienteForm.valid) {
      this.ubigeo = this.ubigeos.find((ubigeo) => ubigeo.departamento == this.departamento && ubigeo.provincia == this.provincia && ubigeo.distrito == this.distrito) || null;
      let persona: Persona
      // persona.documento = this.registerPacienteForm.value.documento;

      this.personaService.insertPersona(this.registerPacienteForm.value).subscribe({
        next: (res: any) => {
          this.usuarioService.insertUsuario(this.registerPacienteForm.value).subscribe({
            next: (res: any) => {
              this.pacienteService.insertPaciente(this.registerPacienteForm.value).subscribe({
                next: (res: any) => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: res.message,
                  });
                  this.modalRef?.close();
                },
                error: (err) => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.error.message,
                  });
                }
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
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error.message,
          });
        }
      });
    } else if (this.registrarEspecialistaForm.valid) {
      this.personaService.insertPersona(this.registrarEspecialistaForm.value).subscribe({
        next: (res: any) => {
          this.usuarioService.insertUsuario(this.registrarEspecialistaForm.value).subscribe({
            next: (res: any) => {
              this.especialistaService.insertEspecialista(this.registrarEspecialistaForm.value).subscribe({
                next: (res: any) => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: res.message,
                  });
                  this.modalRef?.close();
                },
                error: (err) => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.error.message,
                  });
                }
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

  openModal(content: any) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  ngOnDestroy() {
    this.modalRef?.close();
  }
}
