import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Ticket } from '../../ticket/types/ticket.types';
import { HttpResponse } from '@angular/common/http';
import { ApiService } from '../../../shared/services/api.service';
import { environment } from '../../../shared/helpers/environment';

@Injectable({
  providedIn: 'root'
})
export class ModeratorService {
  private adminTickets = new BehaviorSubject<Ticket[]>([]);
  adminTickets$ = this.adminTickets.asObservable();

  constructor(
    private api: ApiService,
  ) { }

  getModeratorStatusPanel(): Observable<HttpResponse<any>> {
    return this.api.get(`${environment.apiUrl}/moderator-dashboard/status-panel`);
  }

  editStatus(ticket: { id: string, status: string }) {
    return this.api.post(`${environment.apiUrl}/moderator-dashboard/status-panel/update-status`, ticket);
  }
}