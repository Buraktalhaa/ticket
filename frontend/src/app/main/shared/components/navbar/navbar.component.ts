import { Component } from '@angular/core';
import { AuthButtonsComponent } from '../auth-buttons/auth-buttons.component';
import { ProfileService } from '../../../../profile/shared/services/profile.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../shared/services/notification.service';
import { AuthService } from '../../../../auth/shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    AuthButtonsComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(
    private profileService: ProfileService,
    public authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}
  
  getMyProfile() {
    this.profileService.myProfile().subscribe({
      next: (res: any) => {
        this.profileService.setProfileData(res.body?.data.user)
        this.router.navigateByUrl('/my-profile');
      },
      error: (err:any) => {
        this.notificationService.showNotification('error', 'Profile could not be loaded.');
        console.error(err);
      }
    });
  }
}