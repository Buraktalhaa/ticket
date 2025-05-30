import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Ticket } from '../types/ticket.types';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private selectedTicket: any;

  private ticketsSubject = new BehaviorSubject<Ticket[]>([]);
  tickets$ = this.ticketsSubject.asObservable();

  constructor(
    private api: ApiService,
    private notificationService: NotificationService
  ) { }

  allTickets() {
    this.api.get('http://localhost:3000/ticket/get-tickets').subscribe({
      next: (res: HttpResponse<any>) => {
        const data = res.body?.data || [];
        this.ticketsSubject.next(data);
      },
      error: (err) => {
        console.error('ticket error:', err);
        this.notificationService.showNotification('error', 'Tickets could not be loaded. Please try again later.');
      }
    });
  }

  categoryTickets(category: string) {
    this.api.get(`http://localhost:3000/ticket/get-tickets/by-category/${category}`).subscribe({
      next: (res: HttpResponse<any>) => {
        const data = res.body?.data || [];        
        this.ticketsSubject.next(data);
      },
      error: (err) => {
        console.error('ticket category error:', err);
        this.notificationService.showNotification('error', `Tickets for category "${category}" could not be loaded.`);
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
