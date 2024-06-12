import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-realizar-test',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class RealizarTestComponent {

}
