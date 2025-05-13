import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../shared/services/auth.service';
import { AuthInputComponent } from '../shared/components/auth-input/auth-input.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AuthInputComponent
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string = '';
  firstName: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService) { }

  signUp() {
    if (!this.email || !this.firstName || !this.password || !this.confirmPassword) {
      console.log("Missing information");
      console.log(this.email, this.firstName, this.password, this.confirmPassword)
      return;
    }

    if (this.password !== this.confirmPassword) {
      console.log("Şifreler uyuşmuyor");
      return;
    }

    // Mail kontrol TODO:
    // Sifre uzunluk kontrol TODO:

    const signupData = {
      email: this.email,
      firstName: this.firstName,
      password: this.password,
      role: "user"
    };

    this.authService.signUp(signupData)
  }

  signupWithGoogle() {
    console.log("google ile giris yapma ekrani");
  }
}



