import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, NgbModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  user: String | null = "";

  @ViewChild('dash') dash!: ElementRef;

  constructor(
    private modalService: NgbModal,
  ) {
    this.user = localStorage.getItem('user');

    console.log("User: ", this.user);

    // if (this.user == 'estudiante') {
    //   this.openRegisterModal(this.dash)
    // }

  }

  // openRegisterModal(content: any) {
  //   this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
  //     (result) => {
  //       console.log(`Closed with: ${result}`);
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }
}
