import { Component } from '@angular/core';
import { NavbarComponent } from '../../../main/shared/components/navbar/navbar.component';
import { TicketService } from '../../shared/services/ticket.service';
import { TicketCardComponent } from '../../shared/components/ticket-card/ticket-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-tickets',
  imports: [
    NavbarComponent,
    TicketCardComponent
  ],
  templateUrl: './seller-tickets.component.html',
  styleUrl: './seller-tickets.component.css'
})
export class SellerTicketsComponent {
  tickets: any[] = [];

  constructor(
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit() {
    this.ticketService.sellerTickets$.subscribe(data => {
      this.tickets = data;
      console.log(data)
    });

    this.ticketService.getSellerTickets();
  }

  goToEditPage(ticket: any) {
    this.router.navigate(['/seller/tickets/edit'], { state: { ticket } });
  }
}