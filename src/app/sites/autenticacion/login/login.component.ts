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
  checkpass: boolean = false;
  modalRef?: NgbModalRef | null = null;
  usuarios: Usuario[] = [];
  usuario: Usuario | null = null;
  pacientes: Paciente[] = [];
  paciente: Paciente | null = null;
  especialistas: Especialista[] = [];
  especialista: Especialista | null = null;
  tipo_usuario: string = localStorage.getItem('user') || '';

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
      id_ubigeo: new FormControl(''),
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
      id_ubigeo: new FormControl(''),
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

  checkPasswords(form: FormGroup) {
    const password = form.value.password;
    const confirmPassword = form.value.confirm_password;
    console.log(password, confirmPassword);
    // If both are filled and they are not the same, set an error
    if (password && confirmPassword && password !== confirmPassword) {
      form.get('confirm_password')?.setErrors({ notSame: true });
      this.checkpass = false;
    } else {
      form.get('confirm_password')?.setErrors(null);
      this.checkpass = true;
    }
  }

  register() {
    console.log(this.registerPacienteForm.value);
    console.log(this.registrarEspecialistaForm.value);

    if (this.tipo_usuario==="paciente" && this.registerPacienteForm.valid && this.checkpass) {
      this.ubigeo = this.ubigeos.find((ubigeo) => ubigeo.departamento == this.departamento && ubigeo.provincia == this.provincia && ubigeo.distrito == this.distrito) || null;
      this.registerPacienteForm.value.id_ubigeo = this.ubigeos.find((ubigeo) => ubigeo.departamento == this.departamento && ubigeo.provincia == this.provincia && ubigeo.distrito == this.distrito)?.id_ubigeo;
      const persona = {
        documento: this.registerPacienteForm.value.documento,
        tipo_documento: this.registerPacienteForm.value.tipo_documento,
        nombre: this.registerPacienteForm.value.nombre,
        apellido_paterno: this.registerPacienteForm.value.apellido_paterno,
        apellido_materno: this.registerPacienteForm.value.apellido_materno,
        telefono: this.registerPacienteForm.value.telefono,
        fecha_nacimiento: this.registerPacienteForm.value.fecha_nacimiento,
        sexo: this.registerPacienteForm.value.sexo,
        id_ubigeo: this.registerPacienteForm.value.id_ubigeo,
      };
      console.log("Persona: ", persona);

      this.personaService.insertPersona(persona).subscribe({
        next: (res: any) => {
          const usuario = {
            documento: this.registerPacienteForm.value.documento,
            correo: this.registerPacienteForm.value.correo,
            password: this.registerPacienteForm.value.password,
          };
          this.usuarioService.insertUsuario(usuario).subscribe({
            next: (res: any) => {
              this.usuarioService.getUsuario(this.registerPacienteForm.value.documento).subscribe((data: any) => {
                this.usuario = data.usuario;
                console.log("Usuario existe?: ", this.usuario);
                if (this.usuario != null){
                  this.pacienteService.getPaciente(this.usuario.id_usuario).subscribe((data: any) => {
                    this.paciente = data.paciente;
                    console.log("Paciente existe?: ", this.paciente);
                  }, (err) => {
                    if (this.paciente == null){
                      const paciente = {
                        id_usuario: this.usuario?.id_usuario,
                      };
                      console.log("Paciente: ", paciente);
                      this.pacienteService.insertPaciente(paciente).subscribe({
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
                    }
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

    if (this.tipo_usuario==="especialista" && this.registrarEspecialistaForm.valid && this.checkpass) {
      this.ubigeo = this.ubigeos.find((ubigeo) => ubigeo.departamento == this.departamento && ubigeo.provincia == this.provincia && ubigeo.distrito == this.distrito) || null;
      this.registrarEspecialistaForm.value.id_ubigeo = this.ubigeos.find((ubigeo) => ubigeo.departamento == this.departamento && ubigeo.provincia == this.provincia && ubigeo.distrito == this.distrito)?.id_ubigeo;
      const persona = {
        documento: this.registrarEspecialistaForm.value.documento,
        tipo_documento: this.registrarEspecialistaForm.value.tipo_documento,
        nombre: this.registrarEspecialistaForm.value.nombre,
        apellido_paterno: this.registrarEspecialistaForm.value.apellido_paterno,
        apellido_materno: this.registrarEspecialistaForm.value.apellido_materno,
        telefono: this.registrarEspecialistaForm.value.telefono,
        fecha_nacimiento: this.registrarEspecialistaForm.value.fecha_nacimiento,
        sexo: this.registrarEspecialistaForm.value.sexo,
        id_ubigeo: this.registrarEspecialistaForm.value.id_ubigeo,
      };
      console.log("Persona: ", persona);
      this.personaService.insertPersona(persona).subscribe({
        next: (res: any) => {
          const usuario = {
            documento: this.registrarEspecialistaForm.value.documento,
            correo: this.registrarEspecialistaForm.value.correo,
            password: this.registrarEspecialistaForm.value.password,
          };
          this.usuarioService.insertUsuario(usuario).subscribe({
            next: (res: any) => {
              this.usuarioService.getUsuario(this.registrarEspecialistaForm.value.documento).subscribe((data: any) => {
                this.usuario = data.usuario;
                console.log(this.usuario);
                if (this.usuario){
                  this.pacienteService.getPaciente(this.usuario.id_usuario).subscribe((data: any) => {
                    this.paciente = data.paciente;
                    console.log(this.paciente);
                  },
                  (err) => {
                    if (this.paciente == null){
                      const paciente = {
                        id_usuario: this.usuario?.id_usuario,
                      };
                      this.pacienteService.insertPaciente(paciente).subscribe({});
                    }
                  }
                );

                  this.especialistaService.getEspecialista(this.usuario.id_usuario).subscribe((data: any) => {
                    this.especialista = data.especialista;
                    console.log(this.especialista);
                  },
                  (err) => {
                    if (this.especialista == null){
                      const especialista = {
                        id_usuario: this.usuario?.id_usuario,
                        licencia: this.registrarEspecialistaForm.value.licencia,
                        especialidad: this.registrarEspecialistaForm.value.especialidad,
                      };
                      this.especialistaService.insertEspecialista(especialista).subscribe({
                        next: (res: any) => {
                          Swal.fire({
                            icon: 'success',
                            title: 'Registro exitoso',
                            text: res.message,
                          });
                          this.modalRef?.close();
                        }
                      });
                    }
                  }
                  );
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
      this.usuarioService.login(this.loginForm.value).subscribe(
        (res: any) => {
          localStorage.setItem('token', res.access_token);
          const payload = res.access_token ? JSON.parse(atob(res.access_token.split('.')[1])) : null;
          if(this.user == 'especialista' && !payload.isEspecialista){
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No tiene permisos para acceder a esta sección',
            });
          } else {
            this.router.navigate(['/home']);
            Swal.fire({
              icon: 'success',
              title: 'Bienvenido',
              text: res.message,
            });
          }
        },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error.message,
          });
        }
      );
    }
  }

  openModal(content: any) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  ngOnDestroy() {
    this.modalRef?.close();
  }

  regresar(){
      this.router.navigate(['/usuarios']);
  }
}
