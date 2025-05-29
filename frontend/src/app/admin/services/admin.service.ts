import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdminNavigationService } from './admin-navigation.service';
import { Ticket } from '../../pages/ticket/types/ticket.types';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private adminTickets = new BehaviorSubject<Ticket[]>([]);
  adminTickets$ = this.adminTickets.asObservable();

  constructor(
    private api: ApiService,
    private router: Router,
    private adminNavigationService: AdminNavigationService
  ) { }

  getAdminStatusPanel(): Observable<HttpResponse<any>> {
    return this.api.get('http://localhost:3000/ticket/admin/status-panel');
  }

  editStatus(ticket: { id: string, status: string }) {
    return this.api.post('http://localhost:3000/ticket/admin/status-panel/update-status', ticket);
  }
}
