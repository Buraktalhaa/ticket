import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../../types/cart-item.types';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../shared/services/notification.service';
import { OrderService } from '../../../order/services/order.service';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-cart',
  imports: [
    NavbarComponent,
    CommonModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  item: CartItem | null = null;
  discountedPrice = 0
  hasDiscount = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private orderService:OrderService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.cartService.getCurrentItem().subscribe(cartItem => {
      this.item = cartItem;
      if (this.item) {
        const discount = this.item.ticket.discount;
        this.hasDiscount = discount > 0;
        this.discountedPrice = this.item.ticket.price * (1 - discount / 100);
      }
    });
  }
  
  increaseQuantity() {
    const item = this.item;
    const ticket = item?.ticket;
  
    if (!item || !ticket) return 

    if(ticket.stock == undefined) return
  
    if (item.count >= ticket.stock) {
      this.notificationService.showNotification("error", "No more in stock.");
      return;
    }

    const updatedCount = item.count + 1;
    this.cartService.updateItem({
      ticketId: item.ticket.id,
      count: updatedCount
    }).subscribe(() => {
      this.item!.count = updatedCount;
    });
  }
  
  decreaseQuantity() {
    if (!this.item || this.item.count <= 1) return;
    const updatedCount = this.item.count - 1;
    this.cartService.updateItem({
      ticketId: this.item.ticket.id,
      count: updatedCount
    }).subscribe(() => {
      this.item!.count = updatedCount;
    });
  }

  removeItem() {
    this.cartService.clearCart().subscribe(() => {
      this.item = null;
    });
  }

  goToTicketDetail(ticketId: string, category: string){
    this.router.navigate(['/main', category, ticketId]);
  }

  buyTicket() {
    const data = {
      ticketId: this.item?.ticket.id,
      quantity: this.item?.count,
      usePoints: true
    };
  
    this.orderService.buy(data).subscribe({
      next: (response) => {
        const paymentLink = response.body?.paymentLink;
  
        if (paymentLink && paymentLink.startsWith('http')) {
          // payment page
          window.location.href = paymentLink;
        } else {
          this.notificationService.showNotification('error', 'Payment link could not be generated, please try again.');
        }
      },
      error: (error) => {
        const message = error?.error?.message || 'An error occurred while creating an order.';
        this.notificationService.showNotification('error', message);
      }
    });
  }
}