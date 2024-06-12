import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Usuario } from '../models/usuario';
import { UsuariosService } from '../services/usuarios.service';
import { Estudiante } from '../models/estudiante';
import { EstudianteService } from '../services/estudiante.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute} from '@angular/router';
import { NgbModal, NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';  // npm install @ng-bootstrap/ng-bootstrap


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxPaginationModule, NgbModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup; // Use the non-null assertion operator here
  registerForm: FormGroup;
  isFormSubmitted: boolean = false;
  usuarios: Usuario[] = [];
  user: String = '';

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private usuariosService: UsuariosService,
    private estudianteService: EstudianteService,
    private router: Router,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      const navigation = this.router.getCurrentNavigation();
      if (navigation && navigation.extras && navigation.extras.state) {
        this.user = navigation.extras.state['user'];
      }
    });

    console.log(this.user);


    this.loginForm = new FormGroup({
      correo: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    this.registerForm = new FormGroup({
      //Modelo Usuario
      tipo_documento: new FormControl('', [Validators.required]),
      documento: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      apellido_paterno: new FormControl('', [Validators.required]),
      apellido_materno: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      correo: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirm_password: new FormControl('', [Validators.required]),
      //Modelo Estudiante
      anio_ingreso: new FormControl('', [Validators.required]),
      base: new FormControl('', [Validators.required]),
      carrera: new FormControl('', [Validators.required]),
      ciclo_actual: new FormControl('', [Validators.required]),
      cod_estudiante: new FormControl('', [Validators.required]),
      facultad: new FormControl('', [Validators.required])
    });
  }

  login() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.usuariosService.login(this.loginForm.value).subscribe(
        (response: any) => {
          console.log(response);
          localStorage.setItem('token', response.access_token);

          Swal.fire({
            title: 'Inicio de sesión exitoso',
            text: 'Bienvenido',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.error(error);
          Swal.fire({
            title: 'Error',
            text: 'Correo o contraseña incorrectos',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    }
  }

  openRegisterModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        console.log(`Closed with: ${result}`);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  register() {
    if (this.registerForm.valid) {
      //JSON para el modelo Usuario
      const usuario: Usuario = {
        tipo_documento: this.registerForm.value.tipo_documento,
        documento: this.registerForm.value.documento,
        nombre: this.registerForm.value.nombre,
        apellido_paterno: this.registerForm.value.apellido_paterno,
        apellido_materno: this.registerForm.value.apellido_materno,
        telefono: this.registerForm.value.telefono,
        correo: this.registerForm.value.correo,
        password: this.registerForm.value.password,
        id_tipo_rol: 1
      };
      this.usuariosService.insert(usuario).subscribe(
        (response: any) => {
          console.log(response.message);
          //JSON para el modelo Estudiante
          const estudiante: Estudiante = {
            anio_ingreso: this.registerForm.value.anio_ingreso,
            base: this.registerForm.value.base,
            carrera: this.registerForm.value.carrera,
            ciclo_estudio: this.registerForm.value.ciclo_actual,
            cod_alumno: this.registerForm.value.cod_estudiante,
            facultad: this.registerForm.value.facultad,
            documento: this.registerForm.value.documento
          };

          this.estudianteService.insert(estudiante).subscribe(
            (response: any) => {
              console.log(response.message);
              Swal.fire({
                title: 'Registro exitoso',
                text: response.message,
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              this.registerForm.reset();
              this.modalService.dismissAll();
            },
            error => {
              console.log(error);
              Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          );
        },
        error => {
          console.log(error);
          Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );


    }
  }

}
