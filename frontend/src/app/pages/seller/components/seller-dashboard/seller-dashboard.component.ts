import { Component } from '@angular/core';
import { SellerService } from '../../services/seller.service';
import { FooterInfoTextComponent } from '../../../../shared/components/footer-info-text/footer-info-text.component';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-dashboard',
  imports: [
    NavbarComponent,
    FooterInfoTextComponent
  ],
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.css'
})
export class SellerDashboardComponent {
  constructor(
    private sellerService: SellerService,
    private notificationService: NotificationService,
    private router: Router,
  ) { }

  createTicket() {
    this.sellerService.isSeller().subscribe({
      next: () => {
        this.router.navigateByUrl('seller-dashboard/create-ticket');
      },
      error: (err) => {
        console.error('Authorization error (isSeller):', err);
        const msg = err?.error?.message || "You are not authorized as a seller.";
      }
    });
  }


  myTickets() {
    this.router.navigateByUrl('seller-dashboard/my-tickets');
  }
}