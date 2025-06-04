import { Injectable } from '@angular/core';
import { Email, Passwords } from '../types/auth.types';
import { ApiService } from '../../../shared/services/api.service';
import { environment } from '../../../shared/helpers/environment';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  constructor(
    private api: ApiService
  ) { }

  sendNewPassword(data: Passwords) {
    return this.api.post(`${environment.apiUrl}/auth/reset-password/${data.token}`, {
      password: data.password,
      confirmPassword: data.confirmPassword
    })
  }
}