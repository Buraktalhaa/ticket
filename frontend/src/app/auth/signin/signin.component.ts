import { Component } from '@angular/core';
import { AuthInputComponent } from '../shared/components/auth-input/auth-input.component';
import { AuthService } from '../shared/services/auth.service';
@Component({
  selector: 'app-signin',
  imports: [AuthInputComponent],
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

    const signInData = {
      email: this.email,
      password: this.password,
    };
    
    this.authService.signIn(signInData)
  }
}
