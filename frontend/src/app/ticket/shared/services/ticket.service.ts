import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private selectedTicket: any;

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
        this.router.navigateByUrl('/main');
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
        this.ticketsSubject.next(data);
        this.router.navigateByUrl(`/main/${category}`);
      },
      error: (err) => {
        console.error('ticket category error:', err);
      }
    });
  }

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

  routeToCreateTicketPage() {
    this.api.get('http://localhost:3000/ticket/is-seller').subscribe({    //Seller dashbooard yapacaksin hem back hem front
      next: (res: HttpResponse<any>) => {
        const data = res.body?.data;
        this.router.navigateByUrl('seller-dashboard/create-ticket')
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
        next: () => {
          alert('Ticket created successfully')
          this.router.navigateByUrl('seller-dashboard/my-tickets')
        },
        error: (err) => alert('Error: ' + err.error?.message || 'Something went wrong')
      });
  }

  editTicket(ticket: any) {
    this.api.post('http://localhost:3000/ticket/edit-ticket', ticket)
      .subscribe({
        next: (res: HttpResponse<any>) => {
          alert('Ticket edited successfully')
          this.router.navigateByUrl('seller-dashboard/my-tickets')
        },
        error: (err) => alert('Error: ' + err.error?.message || 'Something went wrong')
      });
  }






  goAdminStatusPanel() {
    this.api.get('http://localhost:3000/ticket/admin/status-panel')
      .subscribe({
        next: (res: HttpResponse<any>) => {
          const data = res.body?.data;
          this.adminTickets.next(data);
          this.router.navigateByUrl('admin-dashboard/status-panel')
        },
        error: (err) => {
          console.error('ticket error:', err);
          // this.router.navigateByUrl('/unauthorized');
        }
      })
  }

  editStatus(ticket: any) {
    this.api.post('http://localhost:3000/ticket/admin/status-panel/update-status', ticket)
      .subscribe({
        next: () => {
          alert('Ticket edited successfully')
          this.router.navigateByUrl('admin-dashboard/status-panel')
        },
        error: (err) => alert('Error: ' + err.error?.message || 'Something went wrong')
      });
  }

  setSelectedTicket(ticket: any) {
    this.selectedTicket = ticket;
  }
  
  getSelectedTicket() {
    return this.selectedTicket;
  }

  getTicketById(id: string) {
    return this.api.get(`http://localhost:3000/ticket/get-tickets/by-id/${id}`);
  }
  
}
