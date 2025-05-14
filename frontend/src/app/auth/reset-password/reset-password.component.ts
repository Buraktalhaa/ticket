import { Component, SimpleChanges } from '@angular/core';
import { AuthInputComponent } from '../shared/components/auth-input/auth-input.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  imports: [ 
    AuthInputComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  password:string =''
  confirmPassword:string =''
  token: string | null = null;

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

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
    
    this.authService.sendNewPassword(newPassword)
  }
}