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
}
