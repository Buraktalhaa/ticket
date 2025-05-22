import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../../types/cart-item.types';
import { NavbarComponent } from '../../../main/shared/components/navbar/navbar.component';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCurrentItem().subscribe(cartItem => {
      this.item = cartItem;
    });
  }

  increaseQuantity() {
    const item = this.item;
    const ticket = item?.ticket;
  
    if (!item || !ticket){
      return;
    } 

    if(ticket.stock == undefined) return
  
    if (item.count >= ticket.stock) {
      alert('No more in stock.');
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
  
    this.cartService.buy(data).subscribe(response => {
      const paymentLink = response.body.paymentLink;
      if (paymentLink) {
        // redirect
        window.location.href = paymentLink;
      } else {
        alert('Ödeme linki oluşturulamadı, lütfen tekrar deneyin.');
      }
    }, error => {
      alert('Sipariş oluşturulurken bir hata oluştu.');
    });
  }
}