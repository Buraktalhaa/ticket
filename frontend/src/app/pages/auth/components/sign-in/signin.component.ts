import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthInputComponent } from '../../shared/components/auth-input/auth-input.component';
import { TextLinkComponent } from '../../shared/components/text-link/text-link.component';
import { SignButtonComponent } from '../../shared/components/sign-button/sign-button.component';
import { AuthService } from '../../services/auth.service';
import { FooterInfoTextComponent } from '../../../../shared/components/footer-info-text/footer-info-text.component';
import { NotificationService } from '../../../../shared/services/notification.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { validateSignIn } from '../../../../shared/helpers/auth-validation.helper';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-signin',
  imports: [
    AuthInputComponent,
    CommonModule,
    FormsModule,
    RouterLink,
    TextLinkComponent,
    FooterInfoTextComponent,
    SignButtonComponent
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  email: string = '';
  password: string = '';
  private returnUrl: string = '/main';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.authService.logOut();

    const url = this.route.snapshot.queryParamMap.get('returnUrl');
    console.log('Return URL on sign-in:', url);
    if (url) this.returnUrl = url;
  }

  signIn() {
    // const error = validateSignIn(this.email, this.password)

    // if (error) {
    //   this.notificationService.showNotification("warning", error);
    //   return;
    // }

    const signInData = {
      email: this.email,
      password: this.password,
    };

    this.authService.signIn(signInData).subscribe({
      next: (res: HttpResponse<any>) => {
        const { accessToken, refreshToken } = res.body;

        this.tokenService.handleTokensFromResponse(accessToken, refreshToken);
        this.authService.isThereUser.set(true);

        this.router.navigateByUrl(this.returnUrl);
      },
    });
  }
}