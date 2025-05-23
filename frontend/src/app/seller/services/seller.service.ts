import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CreateTicketDTO, Ticket } from '../../ticket/types/ticket.types';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private sellerTickets = new BehaviorSubject<Ticket[]>([]);
  sellerTickets$ = this.sellerTickets.asObservable();

  constructor(
    private api: ApiService,
    private router: Router
  ) { }

  getMyTickets() {
    this.api.get('http://localhost:3000/ticket/seller/seller-tickets')
      .subscribe({
        next: (res: HttpResponse<any>) => {
          const data = res.body?.data;
          this.sellerTickets.next(data);
          this.router.navigateByUrl('seller-dashboard/my-tickets')
        },
        error: (err) => {
          console.error('ticket error:', err);
        }
      });
  }

  isSeller() {
    this.api.get('http://localhost:3000/ticket/is-seller').subscribe({    //Seller dashbooard yapacaksin hem back hem front
      next: (res: HttpResponse<any>) => {
        const data = res.body?.data;
        this.router.navigateByUrl('seller-dashboard/create-ticket')
      },
      error: (err) => {
        console.error('ticket error:', err);
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
          alert('Ticket edited successfully')
          this.router.navigateByUrl('seller-dashboard/my-tickets')
        },
        error: (err) => alert('Error: ' + err.error?.message || 'Something went wrong')
      });
  }
}
