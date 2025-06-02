import { Injectable } from '@angular/core';
import { Ticket } from '../types/ticket.types';
import { ApiService } from '../../../shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private selectedTicket: any;

  constructor(
    private api: ApiService,
  ) { }

  allTickets() {
    return this.api.get('http://localhost:3000/ticket/get-tickets')
  }

  categoryTickets(category: string) {
    return this.api.get(`http://localhost:3000/ticket/get-tickets/by-category/${category}`)
  }

  setSelectedTicket(ticket: Ticket) {
    this.selectedTicket = ticket;
  }

  getSelectedTicket() {
    console.log('Returning selectedTicket:', this.selectedTicket);
    return this.selectedTicket;
  }

  getTicketById(id: string) {
    return this.api.get(`http://localhost:3000/ticket/get-tickets/by-id/${id}`);
  }
}
