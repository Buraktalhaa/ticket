import { Component, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthInputComponent } from '../../shared/components/auth-input/auth-input.component';
import { FooterInfoTextComponent } from '../../../shared/components/footer-info-text/footer-info-text.component';
import { SignButtonComponent } from '../../shared/components/sign-button/sign-button.component';
import { AuthService } from '../../services/auth.service';
import { PasswordService } from '../../services/password.service';

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
    private passswordService: PasswordService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    console.log(this.token);
    
  }

  onSubmit(){
    const newPassword = {
      password: this.password,
      confirmPassword: this.confirmPassword,
      token:this.token
    }
    console.log(this.token);
    
    this.passswordService.sendNewPassword(newPassword)
  }
}