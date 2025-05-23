import { Component } from '@angular/core';
import { AuthInputComponent } from '../../shared/components/auth-input/auth-input.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterInfoTextComponent } from '../../../shared/components/footer-info-text/footer-info-text.component';
import { SignButtonComponent } from '../../shared/components/sign-button/sign-button.component';
import { PasswordService } from '../../services/password.service';

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
    private passwordService:PasswordService
  ) { }

  send(){
    const mailData = {
      email:this.email
    }
    this.passwordService.sendResetMail(mailData)
  }
}