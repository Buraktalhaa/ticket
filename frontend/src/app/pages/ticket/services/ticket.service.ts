import { Injectable } from '@angular/core';
import { Ticket } from '../types/ticket.types';
import { ApiService } from '../../../shared/services/api.service';
import { environment } from '../../../shared/helpers/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  // ticket ve true false gonder(fav icin)
  private selectedTicket: any;

  constructor(
    private api: ApiService,
  ) { }

  allTickets() {
    return this.api.get(`${environment.apiUrl}/ticket/get-tickets`)
  }

  categoryTickets(category: string) {
    return this.api.get(`${environment.apiUrl}/ticket/get-tickets/by-category/${category}`)
  }

  getTicketById(id: string) {
    return this.api.get(`${environment.apiUrl}/ticket/get-tickets/by-id/${id}`);
  }

  setSelectedTicket(ticket: Ticket) {
    this.selectedTicket = ticket;
  }

  getSelectedTicket() {
    console.log('Returning selectedTicket:', this.selectedTicket);
    return this.selectedTicket;
  }
}