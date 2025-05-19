import { Component } from '@angular/core';
import { AuthButtonsComponent } from '../auth-buttons/auth-buttons.component';
import { ProfileService } from '../../../../profile/shared/services/profile.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/shared/services/auth.service';
import { TicketService } from '../../../../ticket/shared/services/ticket.service';

@Component({
  selector: 'app-navbar',
  imports: [
    AuthButtonsComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(
    private profileService: ProfileService,
    public authService: AuthService,
    private router: Router,
    private ticketService: TicketService
  ) {}
  
  getMyProfile() {
    this.profileService.myProfile()
  }

  getAlltickets(){
    this.ticketService.allTickets()
    this.router.navigateByUrl('/tickets');
    // permission gerekmedigi icin burada yonlendirme yapmakta sorun yok
  }

  goToCreateTicket(){
    this.ticketService.routeToCreateTicketPage()
  }

  logOut(){
    localStorage.clear()
    this.router.navigateByUrl('/signin');
  }

  sellerTicket(){
    this.ticketService.getSellerTickets()
  }

  goToAdminStatusPanel(){
    this.ticketService.goAdminStatusPanel()
  }
}