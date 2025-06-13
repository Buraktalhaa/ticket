import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ApiService } from '../../../shared/services/api.service';
import { environment } from '../../../shared/helpers/environment';
import { Ticket } from '../../ticket/types/ticket.types';

@Injectable({
  providedIn: 'root'
})
export class ModeratorService {
  constructor(
    private api: ApiService,
  ) { }

  getModeratorStatusPanel(): Observable<HttpResponse<{data:Ticket[]}>> {
    return this.api.get(`${environment.apiUrl}/moderator-dashboard/status-panel`);
  }

  editStatus(ticket: { id: string, status: string }) {
    return this.api.post(`${environment.apiUrl}/moderator-dashboard/status-panel/update-status`, ticket);
  }
}