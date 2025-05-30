import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { Ticket } from '../../ticket/types/ticket.types';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private adminTickets = new BehaviorSubject<Ticket[]>([]);
  adminTickets$ = this.adminTickets.asObservable();

  constructor(
    private api: ApiService,
  ) { }

  getAdminStatusPanel(): Observable<HttpResponse<any>> {
    return this.api.get('http://localhost:3000/ticket/admin/status-panel');
  }

  editStatus(ticket: { id: string, status: string }) {
    return this.api.post('http://localhost:3000/ticket/admin/status-panel/update-status', ticket);
  }
}