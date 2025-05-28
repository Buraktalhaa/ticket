import { Component } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LabelsComponent } from '../labels/labels.component';
import { NavbarComponent } from '../../../main/shared/components/navbar/navbar.component';
import { FooterInfoTextComponent } from '../../../shared/components/footer-info-text/footer-info-text.component';
import { SellerService } from '../../services/seller.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';
import { Ticket } from '../../types/create-ticket.type';

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
  ticket:Ticket = {
    categoryName: '',
    title: '',
    description: '',
    location: '',
    city: '',
    pointRate: 0,
    price: 0,
    pointExpiresAt: '',
    discount: 0,
    stock: 0,
    dateTime:'',
    images: [] as string[]
  };

  constructor(private http: HttpClient,
    private sellerService: SellerService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  categoryOptions = ['Concert', 'Hotel', 'Event', 'Train', 'Bus'];

  validateTicket(): string | null {
    if (!this.ticket.categoryName) return 'Category is required';
    if (!this.ticket.title) return 'Title is required';
    if (!this.ticket.description) return 'Description is required';
    if (!this.ticket.city) return 'City is required';
    if (!this.ticket.location) return 'Location is required';
    if (!this.ticket.dateTime) return 'Date is required';
    if (this.ticket.price <= 0) return 'Price must be greater than 0';
    if (this.ticket.stock < 0) return 'Stock cannot be negative';
    if (this.ticket.pointRate < 0) return 'Point rate cannot be negative';
    if (this.ticket.discount < 0 || this.ticket.discount > 100) return 'Discount must be between 0 and 100';

    if (this.ticket.pointExpiresAt && isNaN(Date.parse(this.ticket.pointExpiresAt))) {
      return 'Point expiry date is invalid';
    }

    return null;
  }

  createTicket() {
    const validationError = this.validateTicket();
    if (validationError) {
      this.notificationService.showNotification('warning', validationError);
      return;
    }

    const payload = {
      ...this.ticket,
      pointRate: Number(this.ticket.pointRate),
      price: Number(this.ticket.price),
      discount: Number(this.ticket.discount),
      stock: Number(this.ticket.stock),
      pointExpiresAt: this.ticket.pointExpiresAt ? new Date(this.ticket.pointExpiresAt).toISOString() : '',
      dateTime: new Date(this.ticket.dateTime).toISOString(),
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