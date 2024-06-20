import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgbModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  user: String | null = "";
  constructor(
    private modalService: NgbModal,
  ) {
    this.user = localStorage.getItem('user');

    console.log("User: ", this.user);
}

}