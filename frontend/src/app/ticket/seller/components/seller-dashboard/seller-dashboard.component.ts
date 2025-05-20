import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../main/shared/components/navbar/navbar.component';
import { TicketService } from '../../../shared/services/ticket.service';

@Component({
  selector: 'app-seller-dashboard',
  imports: [
    NavbarComponent
  ],
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.css'
})
export class SellerDashboardComponent {
  constructor(
    private ticketService:TicketService
  ){

  }
  createTicket(){
    this.ticketService.routeToCreateTicketPage()
  }

  myTickets(){
    this.ticketService.getMyTickets()
  }
}
