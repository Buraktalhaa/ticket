import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CreateTicketDTO, Ticket } from '../../ticket/types/ticket.types';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private sellerTickets = new BehaviorSubject<Ticket[]>([]);
  sellerTickets$ = this.sellerTickets.asObservable();

  constructor(
    private api: ApiService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  getMyTickets() {
    this.api.get('http://localhost:3000/ticket/seller/seller-tickets')
      .subscribe({
        next: (res: HttpResponse<any>) => {
          const data = res.body?.data;
          this.sellerTickets.next(data);
          this.router.navigateByUrl('seller-dashboard/my-tickets')
        },
        error: () => {
          this.notificationService.showNotification("error", "Failed to fetch your tickets.");
        }
      });
  }

  isSeller() {
    this.api.get('http://localhost:3000/ticket/is-seller').subscribe({ 
      next: (res: HttpResponse<any>) => {
        const data = res.body?.data;
        this.router.navigateByUrl('seller-dashboard/create-ticket')
      },
      error: (err) => {
        this.notificationService.showNotification("warning", "You are not authorized as a seller.");
      }
    });
  }

  createTicket(ticket: CreateTicketDTO) {
    return this.api.post('http://localhost:3000/ticket/create-ticket', ticket);
  }

  editTicket(ticket: Ticket | null) {
    this.api.post('http://localhost:3000/ticket/edit-ticket', ticket)
      .subscribe({
        next: (res: HttpResponse<any>) => {
          this.notificationService.showNotification("success", "Ticket updated successfully");
          this.router.navigateByUrl('seller-dashboard/my-tickets')
        },
        error: () =>{
          this.notificationService.showNotification("error", "Failed to update the ticket.");
        }
      });
  }
}
