import { Component } from '@angular/core';
import { AuthInputComponent } from '../shared/components/auth-input/auth-input.component';
import { AuthService } from '../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-signin',
  imports: [
    AuthInputComponent,
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) { }

  signIn() {
    if (!this.email || !this.password) {
      console.log("Missing information");
      return;
    }
    console.log("Degerler", this.email, this.password)

    const signInData = {
      email: this.email,
      password: this.password,
    };

    this.authService.signIn(signInData)
  }
}