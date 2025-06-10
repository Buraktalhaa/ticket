import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SignButtonComponent } from '../../shared/components/sign-button/sign-button.component';
import { TextLinkComponent } from '../../shared/components/text-link/text-link.component';
import { AuthInputComponent } from '../../shared/components/auth-input/auth-input.component';
import { FooterInfoTextComponent } from '../../../../shared/components/footer-info-text/footer-info-text.component';
import { NotificationService } from '../../../../shared/services/notification.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { validateSignUp } from '../../../../shared/helpers/auth-validation.helper';

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
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private tokenService: TokenService
  ) { }

  signUp() {
    // const error = validateSignUp(this.email, this.firstName, this.password, this.confirmPassword)

    // if (error) {
    //   this.notificationService.showNotification("warning", error);
    //   return;
    // }

    const signUpData = {
      email: this.email,
      firstName: this.firstName,
      password: this.password,
    };

    this.authService.signUp(signUpData).subscribe({
      next: () => {
        this.authService.isThereUser.set(true);
        this.router.navigateByUrl("/sign-in");
      },
      error: (err: HttpErrorResponse) => {
        console.error('Sign up error:', err);
      }
    });
  }

  signUpWithGoogle() {
    this.authService.signInGoogle().
      subscribe((res: HttpResponse<any>) => {
        this.tokenService.handleTokensFromResponse(res.body.accessToken, res.body.refreshToken);
        this.authService.isThereUser.set(true);

        setTimeout(() => {
          this.router.navigateByUrl('/main');
        }, 2000);
      });
  }
}