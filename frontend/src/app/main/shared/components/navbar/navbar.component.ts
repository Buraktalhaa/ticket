import { Component } from '@angular/core';
import { AuthButtonsComponent } from '../auth-buttons/auth-buttons.component';
import { ProfileService } from '../../../../profile/shared/services/profile.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/shared/services/auth.service';
import { TicketService } from '../../../../ticket/shared/services/ticket.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  imports: [
    AuthButtonsComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  role: string | null = null;
  isLoggedIn: boolean = false;

  constructor(
    private profileService: ProfileService,
    public authService: AuthService,
    private router: Router,
    private ticketService: TicketService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.role = this.cookieService.get('role');
    this.isLoggedIn = this.cookieService.check('accessToken');
  }

  getMyProfile() {
    this.profileService.myProfile()
  }

  getAlltickets() {
    this.ticketService.allTickets()
  }

  goToAdminDashboard() {
    this.router.navigateByUrl('/admin-dashboard');
  }

  goToSellerDashboard() {
    this.router.navigateByUrl('/seller-dashboard');
  }

  logOut() {
    this.authService.logOut()
  }
}