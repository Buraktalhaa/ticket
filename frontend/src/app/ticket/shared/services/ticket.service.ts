import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private ticketsSubject = new BehaviorSubject<any[]>([]);
  tickets$ = this.ticketsSubject.asObservable();

  private sellerTickets = new BehaviorSubject<any[]>([]);
  sellerTickets$ = this.sellerTickets.asObservable();

  private adminTickets = new BehaviorSubject<any[]>([]);
  adminTickets$ = this.adminTickets.asObservable();

  constructor(
    private api: ApiService,
    private router: Router
  ) { }

  allTickets() {
    this.api.get('http://localhost:3000/ticket/get-tickets').subscribe({
      next: (res: HttpResponse<any>) => {
        const data = res.body?.data || [];
        this.ticketsSubject.next(data);
      },
      error: (err) => {
        console.error('ticket error:', err);
      }
    });
  }

  routeToCreateTicketPage() {
    this.api.get('http://localhost:3000/ticket/is-seller').subscribe({
      next: (res: HttpResponse<any>) => {
        const data = res.body?.data;
        this.router.navigateByUrl('create-ticket')
      },
      error: (err) => {
        console.error('ticket error:', err);
        // this.router.navigateByUrl('/unauthorized');
      }
    });
  }

  createTicket(ticket: any) {
    this.api.post('http://localhost:3000/ticket/create-ticket', ticket)
      .subscribe({
        next: () => alert('Ticket created successfully'),
        error: (err) => alert('Error: ' + err.error?.message || 'Something went wrong')
      });
  }

  getSellerTickets() {
    this.api.get('http://localhost:3000/ticket/seller/sellerTickets')
      .subscribe({
        next: (res: HttpResponse<any>) => {
          const data = res.body?.data;
          this.sellerTickets.next(data);
          this.router.navigateByUrl('seller/sellerTickets')
        },
        error: (err) => {
          console.error('ticket error:', err);
          // this.router.navigateByUrl('/unauthorized');
        }
      });
  }

  editTicket(ticket: any) {
    this.api.post('http://localhost:3000/ticket/edit-ticket', ticket)
      .subscribe({
        next: () => alert('Ticket edited successfully'),
        error: (err) => alert('Error: ' + err.error?.message || 'Something went wrong')
      });
  }

  goAdminStatusPanel() {
    this.api.get('http://localhost:3000/ticket/admin/statusPanel')
      .subscribe({
        next: (res: HttpResponse<any>) => {
          const data = res.body?.data;
          this.adminTickets.next(data);
          this.router.navigateByUrl('admin/statusPanel/tickets')
        },
        error: (err) => {
          console.error('ticket error:', err);
          // this.router.navigateByUrl('/unauthorized');
        }
      })
  }

  editStatus(ticket: any) {
    this.api.post('http://localhost:3000/ticket/admin/statusPanel/update-status', ticket)
      .subscribe({
        next: () => alert('Ticket edited successfully'),
        error: (err) => alert('Error: ' + err.error?.message || 'Something went wrong')
      });
  }
}
