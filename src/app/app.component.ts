import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BienvenidaComponent } from './sites/autenticacion/bienvenida/bienvenida.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BienvenidaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dsw-g12-frontend-cus';
}
