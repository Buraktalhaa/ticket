import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Email, Passwords } from '../types/auth.types';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  constructor(
    private api: ApiService, 
    private router: Router,
    private notificationService: NotificationService
  ) {}

  sendResetMail(email: Email) {
    this.api.post('http://localhost:3000/auth/forgot-password', email).subscribe({
      next: () => {
        this.notificationService.showNotification('success', 'Password reset mail sent successfully.');
        this.router.navigateByUrl('/mail-sent');
      },
      error: (err) => {
        console.error('Error sending reset mail:', err);
        const msg = err.error?.message || 'Failed to send reset mail.';
        this.notificationService.showNotification('error', msg);
      }
    });
  }

  sendNewPassword(data: Passwords) {
    this.api.post(`http://localhost:3000/auth/reset-password/${data.token}`, {
      password: data.password,
      confirmPassword: data.confirmPassword
    }).subscribe({
      next: () => {
        this.notificationService.showNotification('success', 'Password has been reset successfully.');
        this.router.navigateByUrl('/mail-sent');
      },
      error: (err) => {
        console.error('Error resetting password:', err);
        const msg = err.error?.message || 'Failed to reset password.';
        this.notificationService.showNotification('error', msg);
      }
    });
  }
}