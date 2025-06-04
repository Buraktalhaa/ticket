import { Injectable } from '@angular/core';
import { Email } from '../types/auth.types';
import { ApiService } from '../../../shared/services/api.service';
import { environment } from '../../../shared/helpers/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetMailService {

  constructor(private api: ApiService,
  ) { }
  sendResetMail(email: Email) {
    return this.api.post(`${environment.apiUrl}/auth/forgot-password`, email)
  }
}
