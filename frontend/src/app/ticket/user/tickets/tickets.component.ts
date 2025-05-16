import { Component } from '@angular/core';
import { NavbarComponent } from '../../../main/shared/components/navbar/navbar.component';
import { TicketService } from '../../shared/services/ticket.service';
import { TicketCardComponent } from '../../shared/components/ticket-card/ticket-card.component';

@Component({
  selector: 'app-tickets',
  imports: [
    NavbarComponent,
    TicketCardComponent
  ],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent {
  tickets: any[] = [];

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.ticketService.tickets$.subscribe(data => {
      this.tickets = data;
      console.log(data)
    });

    this.ticketService.allTickets();
  }
}
