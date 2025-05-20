import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../main/shared/components/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../../shared/services/ticket.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    NavbarComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  constructor(
    private ticketService: TicketService,
  ){}
  goToAdminStatusPanel(){
    this.ticketService.goAdminStatusPanel()
  }
}
