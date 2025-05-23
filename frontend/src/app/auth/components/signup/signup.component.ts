import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SignButtonComponent } from '../../shared/components/sign-button/sign-button.component';
import { FooterInfoTextComponent } from '../../../shared/components/footer-info-text/footer-info-text.component';
import { TextLinkComponent } from '../../shared/components/text-link/text-link.component';
import { AuthInputComponent } from '../../shared/components/auth-input/auth-input.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AuthInputComponent,
    TextLinkComponent,
    FooterInfoTextComponent,
    SignButtonComponent
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string = '';
  firstName: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthService
  ) { }

  signUp() {
    if (!this.email || !this.firstName || !this.password || !this.confirmPassword) {
      console.log("Missing information");
      console.log(this.email, this.firstName, this.password, this.confirmPassword)
      return;
    }

    if (this.password !== this.confirmPassword) {
      console.log("Passwords are not the same");
      return;
    }

    // Mail kontrol TODO:
    // Sifre uzunluk kontrol TODO:

    const signUpData = {
      email: this.email,
      firstName: this.firstName,
      password: this.password,
    };

    this.authService.signUp(signUpData)
  }

  signUpWithGoogle() {
    console.log("Google login screen");
    this.authService.signInGoogle();
  }
}