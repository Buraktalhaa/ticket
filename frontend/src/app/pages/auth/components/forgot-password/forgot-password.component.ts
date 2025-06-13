import { Component } from '@angular/core';
import { AuthInputComponent } from '../../shared/components/auth-input/auth-input.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignButtonComponent } from '../../shared/components/sign-button/sign-button.component';
import { FooterInfoTextComponent } from '../../../../shared/components/footer-info-text/footer-info-text.component';
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
  ) { }

  send(){
    const mailData = {
      email:this.email
    }
    this.resetMail.sendResetMail(mailData).subscribe({
      next: () => {
        this.router.navigateByUrl('/mail-sent');
      }
    });
  }
}