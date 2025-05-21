import { Component } from '@angular/core';
import { NavbarComponent } from '../../../main/shared/components/navbar/navbar.component';
import { TicketService } from '../../../ticket/services/ticket.service';
import { FooterInfoTextComponent } from '../../../shared/components/footer-info-text/footer-info-text.component';

@Component({
  selector: 'app-seller-dashboard',
  imports: [
    NavbarComponent,
    FooterInfoTextComponent
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
