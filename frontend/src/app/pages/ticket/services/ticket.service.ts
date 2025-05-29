import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Ticket } from '../types/ticket.types';
import { ApiService } from '../../../shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private selectedTicket: any;

  private ticketsSubject = new BehaviorSubject<Ticket[]>([]);
  tickets$ = this.ticketsSubject.asObservable();

  constructor(
    private api: ApiService,
  ) { }

  allTickets() {
    this.api.get('http://localhost:3000/ticket/get-tickets').subscribe({
      next: (res: HttpResponse<any>) => {
        const data = res.body?.data || [];
        console.log(res.body);
        this.ticketsSubject.next(data);
      },
      error: (err) => {
        console.error('ticket error:', err);
      }
    });
  }

  categoryTickets(category: string) {
    this.api.get(`http://localhost:3000/ticket/get-tickets/by-category/${category}`).subscribe({
      next: (res: HttpResponse<any>) => {
        const data = res.body?.data || [];
        console.log(res.body);
        
        this.ticketsSubject.next(data);
      },
      error: (err) => {
        console.error('ticket category error:', err);
      }
    });
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
