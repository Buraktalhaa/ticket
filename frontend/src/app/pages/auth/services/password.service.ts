import { Injectable } from '@angular/core';
import { Email, Passwords } from '../types/auth.types';
import { ApiService } from '../../../shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  constructor(
    private api: ApiService
  ) { }

  sendNewPassword(data: Passwords) {
    return this.api.post(`http://localhost:3000/auth/reset-password/${data.token}`, {
      password: data.password,
      confirmPassword: data.confirmPassword
    })
  }
}