import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthInputComponent } from '../../shared/components/auth-input/auth-input.component';
import { SignButtonComponent } from '../../shared/components/sign-button/sign-button.component';
import { PasswordService } from '../../services/password.service';
import { FooterInfoTextComponent } from '../../../../shared/components/footer-info-text/footer-info-text.component';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-reset-password',
  imports: [ 
    AuthInputComponent,
    CommonModule,
    FormsModule,
    FooterInfoTextComponent,
    SignButtonComponent
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  password:string =''
  confirmPassword:string =''
  token: string | null = null;

  constructor(
    private route: ActivatedRoute, 
    private passswordService: PasswordService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');    
  }

  onSubmit(){
    const newPassword = {
      password: this.password,
      confirmPassword: this.confirmPassword,
      token:this.token
    }    
    this.passswordService.sendNewPassword(newPassword).subscribe({
      next: () => {
        this.notificationService.showNotification('success', 'Password has been reset successfully.');
        this.router.navigateByUrl('/mail-sent');
      },
      error: (err) =>{
        console.error('Error resetting password:', err);
        const msg = err.error?.message || 'Failed to reset password.';
        this.notificationService.showNotification('error', msg);
      }
    })
  }
}