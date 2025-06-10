import { Injectable } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { CartService } from '../../cart/services/cart.service';
import { Ticket } from '../types/ticket.types';

@Injectable({
  providedIn: 'root'
})
export class TicketPurchaseHelperService {

  constructor(
    private notificationService: NotificationService,
    private cartService: CartService,

  ) { }

  purchaseTicket(ticket: Ticket, ticketCount:number){
    const newItem = {
      ticketId: ticket.id,
      count: ticketCount
    };

    const stock = ticket.stock;

    if (newItem.count > stock) {
      this.notificationService.warning(`There are only ${stock} tickets available in stock.`);
      return;
    }

    this.cartService.getCurrentItem().subscribe(existing => {
      if (existing) {
        if (existing.ticket.id !== newItem.ticketId) {
          const confirmed = confirm(`You already have "${existing.ticket.title}" in your cart. Do you want to replace it?`);

          if (confirmed) {
            this.cartService.clearCart().subscribe(() => {
              this.cartService.addToCart(newItem).subscribe(() => {
                this.notificationService.info(`Previous item removed. "${ticket.title}" added to your cart.`);
              });
            });
          } else {
            this.notificationService.info("Cart remains unchanged.");
          }
        } else {
          const totalCount = existing.count + newItem.count;

          if (totalCount > stock) {
            this.notificationService.warning(`You already have ${existing.count} tickets. You can’t add more than ${stock} in total.`);
            return;
          }

          const updatedItem = {
            ticketId: existing.ticket.id,
            count: totalCount
          };

          this.cartService.updateCart(updatedItem).subscribe(() => {
            this.notificationService.success(`Cart updated. You now have ${updatedItem.count} tickets.`
            );
          });
        }
      } else {
        this.cartService.addToCart(newItem).subscribe(() => {
          this.notificationService.success(`"${ticket.title}" added to your cart.`
          );
        });
      }
    });
  }
}
