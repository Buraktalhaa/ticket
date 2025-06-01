import { Injectable } from '@angular/core';
import { Email } from '../types/auth.types';
import { ApiService } from '../../../shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ResetMailService {

  constructor(private api: ApiService,
  ) { }
  sendResetMail(email: Email) {
    return this.api.post('http://localhost:3000/auth/forgot-password', email)
  }
}
