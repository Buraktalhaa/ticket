import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../../types/cart-item.types';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../shared/services/notification.service';
import { OrderService } from '../../../order/services/order.service';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { canDecreaseQuantity, canIncreaseQuantity } from '../../helpers/cart-quantity.helper';
import { handleOrderError, handlePaymentRedirect } from '../../helpers/payment.helper';
import { HttpErrorResponse } from '@angular/common/http';
import { calculateDiscountedPrice } from '../../../../shared/helpers/discount.helper';

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
    private orderService: OrderService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.cartService.getCurrentItem().subscribe(cartItem => {
      this.item = cartItem;
      if (this.item) {
        const discount = this.item.ticket.discount;
        this.hasDiscount = discount > 0;
        this.discountedPrice = calculateDiscountedPrice(this.item.ticket.price, discount);
      }
    });
  }

  increaseQuantity() {
    const error = canIncreaseQuantity(this.item)

    if (error) {
      this.notificationService.showNotification("error", error);
      return;
    }

    const updatedCount = this.item!.count + 1;
    this.cartService.updateCart({ticketId: this.item!.ticket.id, count: updatedCount
    }).subscribe(() => {
      this.item!.count = updatedCount;
    });
  }

  decreaseQuantity() {
    const error = canDecreaseQuantity(this.item);
    if (error) {
      this.notificationService.showNotification("error", error);
      return;
    }
    const updatedCount = this.item!.count - 1;
    this.cartService.updateCart({ticketId: this.item!.ticket.id, count: updatedCount
    }).subscribe(() => {
      this.item!.count = updatedCount;
    });
  }

  removeTicket() {
    this.cartService.clearCart().subscribe(() => {
      this.item = null;
    });
  }

  goToTicketDetail(ticketId: string, category: string) {
    this.router.navigate(['/main', category, ticketId]);
  }

  buyTicket() {
    const data = { ticketId: this.item?.ticket.id, quantity: this.item?.count, usePoints: true };
  
    this.orderService.createOrder(data).subscribe({
      next: (response) => handlePaymentRedirect(response, this.notificationService),
      error: (error:HttpErrorResponse) => handleOrderError(error, this.notificationService)
    });
  }
}