import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-alumno',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-alumno.component.html',
  styleUrl: './login-alumno.component.css'
})
export class LoginAlumnoComponent {
  loginForm!: FormGroup; // Use the non-null assertion operator here

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      // Enviar los datos de inicio de sesión al servidor
    }
  }

}
