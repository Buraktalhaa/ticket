import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../types/ticket.types';
import { HttpResponse } from '@angular/common/http';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { CartService } from '../../../cart/services/cart.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-ticket-detail',
  imports: [
    NavbarComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent {
  ticket: Ticket | null = null;
  ticketCount: number = 1;
  currentImageIndex = 0;
  discountedPrice = 0

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router,
    private notificationService: NotificationService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    const ticket = this.ticketService.getSelectedTicket();

    if (ticket) {
      this.ticket = ticket;
      this.discountedPrice = ticket.price * (1 - ticket.discount / 100);
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      if (id == null) return;

      this.ticketService.getTicketById(id).subscribe((res: HttpResponse<any>) => {
        console.log('Ticket API response:', res.body);
        this.ticket = res.body?.data;
        console.log(this.ticket);
        this.discountedPrice = ticket.price * (1 - ticket.discount / 100);
      });
    }
  }

  changeImage(index: number): void {
    this.currentImageIndex = index;
  }

  goToSignIn() {
    const currentUrl = this.router.url;
    console.log('Navigating to sign-in from URL:', currentUrl);
    this.router.navigate(['/sign-in'], {
      queryParams: { returnUrl: currentUrl }
    });
  }

  purchaseTicket() {
    if (!this.ticket) return;

    const newItem = {
      ticketId: this.ticket.id,
      count: this.ticketCount
    };

    const stock = this.ticket.stock;

    if (newItem.count > stock) {
      this.notificationService.showNotification("warning", `There are only ${stock} tickets available in stock.`);
      return;
    }

    this.cartService.getCurrentItem().subscribe(existing => {
      if (existing) {
        if (existing.ticket.id !== newItem.ticketId) {
          const confirmed = confirm(`You already have "${existing.ticket.title}" in your cart. Do you want to replace it?`);

          if (confirmed) {
            this.cartService.clearCart().subscribe(() => {
              this.cartService.addToCart(newItem).subscribe(() => {
                this.notificationService.showNotification("info", `Previous item removed. "${this.ticket?.title}" added to your cart.`);
              });
            });
          } else {
            this.notificationService.showNotification("info", "Cart remains unchanged.");
          }
        } else {
          const totalCount = existing.count + newItem.count;

          if (totalCount > stock) {
            this.notificationService.showNotification("warning", `You already have ${existing.count} tickets. You can’t add more than ${stock} in total.`);
            return;
          }

          const updatedItem = {
            ticketId: existing.ticket.id,
            count: totalCount
          };

          this.cartService.updateItem(updatedItem).subscribe(() => {
            this.notificationService.showNotification("success", `Cart updated. You now have ${updatedItem.count} tickets.`
            );
          });
        }
      } else {
        this.cartService.addToCart(newItem).subscribe(() => {
          this.notificationService.showNotification("success", `"${this.ticket?.title}" added to your cart.`
          );
        });
      }
    });
  }
}