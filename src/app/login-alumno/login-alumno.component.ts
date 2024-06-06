import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Usuario } from '../models/usuario';
import { UsuariosService } from '../services/usuarios.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-alumno',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './login-alumno.component.html',
  styleUrl: './login-alumno.component.css'
})
export class LoginAlumnoComponent {
  loginForm: FormGroup; // Use the non-null assertion operator here
  isFormSubmitted: boolean = false;
  usuarios: Usuario[] = [];

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private usuariosService: UsuariosService
  ) {
    this.loginForm = new FormGroup({
      correo: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  login() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.usuariosService.login(this.loginForm.value).subscribe(
        response => {
          console.log(response);
          Swal.fire({
            title: 'Inicio de sesión exitoso',
            text: 'Bienvenido',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
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

}
