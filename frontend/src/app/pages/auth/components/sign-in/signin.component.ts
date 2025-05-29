import { Component, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthInputComponent } from '../../shared/components/auth-input/auth-input.component';
import { TextLinkComponent } from '../../shared/components/text-link/text-link.component';
import { SignButtonComponent } from '../../shared/components/sign-button/sign-button.component';
import { AuthService } from '../../services/auth.service';
import { FooterInfoTextComponent } from '../../../../shared/components/footer-info-text/footer-info-text.component';
import { NotificationService } from '../../../../shared/services/notification.service';

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
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.authService.logOut();

    const url = this.route.snapshot.queryParamMap.get('returnUrl');
    console.log('Return URL on sign-in:', url);
    if (url) this.returnUrl = url;
  }

  signIn() {
    if (!this.email || !this.password) {
      this.notificationService.showNotification("warning", "Missing information");
      return;
    }

    const signInData = {
      email: this.email,
      password: this.password,
    };

    this.authService.signIn(signInData).subscribe({
      next: () => {
        console.log('Navigating after sign-in to:', this.returnUrl);
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.notificationService.showNotification("error", "Sign in failed");
      }
    });
  }
}