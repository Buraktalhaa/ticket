import { Component } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LabelsComponent } from '../labels/labels.component';
import { NavbarComponent } from '../../../main/shared/components/navbar/navbar.component';
import { FooterInfoTextComponent } from '../../../shared/components/footer-info-text/footer-info-text.component';
import { SellerService } from '../../services/seller.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-create-ticket',
  imports: [
    NavbarComponent,
    LabelsComponent,
    FormsModule,
    FooterInfoTextComponent
  ],
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.css'
})
export class CreateTicketComponent {
  ticket = {
    categoryName: '',
    title: '',
    description: '',
    location: '',
    city: '',
    pointRate: 0,
    price: 0,
    pointExpiresAt: '',
    hour: 0,
    discount: 0,
    day: '',
    stock: 0,
    images: [] as string[]
  };

  constructor(private http: HttpClient,
    private sellerService: SellerService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  categoryOptions = ['Concert', 'Hotel', 'Event', 'Train', 'Bus'];

  createTicket() {
    const payload = {
      ...this.ticket,
      pointRate: Number(this.ticket.pointRate),
      price: Number(this.ticket.price),
      hour: Number(this.ticket.hour),
      discount: Number(this.ticket.discount),
      stock: Number(this.ticket.stock),
      pointExpiresAt: new Date(this.ticket.pointExpiresAt).toISOString(),
      day: new Date(this.ticket.day).toISOString(),
    };

    this.sellerService.createTicket(payload).subscribe({
      next: () => {
        this.notificationService.showNotification("success", "Ticket created successfully");
        setTimeout(() => {
          this.router.navigateByUrl('seller-dashboard/my-tickets');
        }, 500);
      },
      error: () => {
        this.notificationService.showNotification("error", "Something went wrong");
      }
    });
  }
}