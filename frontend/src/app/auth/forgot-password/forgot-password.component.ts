import { Component } from '@angular/core';
import { AuthInputComponent } from '../shared/components/auth-input/auth-input.component';
import { AuthService } from '../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  imports: [ 
    AuthInputComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(private authService: AuthService) { }

  send(){
    console.log("send calisti")
    const mailData = {
      email:this.email
    }

    this.authService.sendMail(mailData)
  }
}