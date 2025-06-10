import { Component } from '@angular/core';
import { AuthInputComponent } from '../../shared/components/auth-input/auth-input.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignButtonComponent } from '../../shared/components/sign-button/sign-button.component';
import { PasswordService } from '../../services/password.service';
import { FooterInfoTextComponent } from '../../../../shared/components/footer-info-text/footer-info-text.component';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Router } from '@angular/router';
import { ResetMailService } from '../../services/reset-mail.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ 
    AuthInputComponent,
    CommonModule,
    FormsModule,
    FooterInfoTextComponent,
    SignButtonComponent
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(
    private resetMail:ResetMailService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  send(){
    const mailData = {
      email:this.email
    }
    this.resetMail.sendResetMail(mailData).subscribe({
      next: () => {
        this.notificationService.success('Password reset mail sent successfully.');
        this.router.navigateByUrl('/mail-sent');
      },
      error: (err) => {
        console.error('Error sending reset mail:', err);
        const msg = err.error?.message || 'Failed to send reset mail.';
        this.notificationService.error(msg);
      }
    });
  }
}