import { Injectable } from '@angular/core';
import { CreateTicketDTO, Ticket } from '../../ticket/types/ticket.types';
import { ApiService } from '../../../shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  constructor(
    private api: ApiService,
  ) { }

  getMyTickets() {
    return this.api.get('http://localhost:3000/ticket/seller/seller-tickets')
  }

  isSeller() {
    return this.api.get('http://localhost:3000/ticket/is-seller');
  }
  
  createTicket(ticket: CreateTicketDTO) {
    return this.api.post('http://localhost:3000/ticket/create-ticket', ticket);
  }

  editTicket(ticket: Ticket | null) {
    return this.api.post('http://localhost:3000/ticket/edit-ticket', ticket)
  }
}