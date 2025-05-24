import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../shared/services/api.service';
import { Ticket } from '../types/ticket.types';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private selectedTicket: any;

  private ticketsSubject = new BehaviorSubject<Ticket[]>([]);
  tickets$ = this.ticketsSubject.asObservable();

  constructor(
    private api: ApiService,
    private router: Router
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
    return this.selectedTicket;
  }

  getTicketById(id: string) {
    return this.api.get(`http://localhost:3000/ticket/get-tickets/by-id/${id}`);
  }
}
