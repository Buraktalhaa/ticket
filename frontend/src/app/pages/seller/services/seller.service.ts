import { Injectable } from '@angular/core';
import { CreateTicketDTO, Ticket } from '../../ticket/types/ticket.types';
import { ApiService } from '../../../shared/services/api.service';
import { environment } from '../../../shared/helpers/environment';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  constructor(
    private api: ApiService,
  ) { }

  getMyTickets() {
    return this.api.get(`${environment.apiUrl}/seller-dashboard/tickets`)
  }

  isSeller() {
    return this.api.get(`${environment.apiUrl}/seller-dashboard/is-seller`);
  }
  
  createTicket(ticket: CreateTicketDTO) {
    return this.api.post(`${environment.apiUrl}/seller-dashboard/create-ticket`, ticket);
  }

  editTicket(ticket: Ticket | null) {
    return this.api.post(`${environment.apiUrl}/seller-dashboard/edit-ticket`, ticket)
  }
}