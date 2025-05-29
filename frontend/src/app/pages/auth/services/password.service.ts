import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Email, Passwords } from '../types/auth.types';
import { ApiService } from '../../../shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  constructor(
    private api: ApiService, 
    private router: Router
  ) {}

  sendResetMail(email: Email) {
    this.api.post('http://localhost:3000/auth/forgot-password', email).subscribe({
      next: () => this.router.navigateByUrl('/mail-sent'),
      error: (err) => console.log('Error message:', err.error?.message)
    });
  }

  sendNewPassword(data: Passwords) {
    this.api.post(`http://localhost:3000/auth/reset-password/${data.token}`, {
      password: data.password,
      confirmPassword: data.confirmPassword
    }).subscribe({
      next: () => this.router.navigateByUrl('/mail-sent'),
      error: (err) => console.log('Error message:', err.error?.message)
    });
  }
}
