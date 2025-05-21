import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../../types/cart-item.types';
import { NavbarComponent } from '../../../main/shared/components/navbar/navbar.component';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [
    NavbarComponent
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  item: CartItem | null = null;

  constructor(
    private cartService: CartService
  ) {}

  // sayfa ilk yuklenince direkt yuklmesi lazim
  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.item = this.cartService.getCurrentItem();
  }

  increaseQuantity() {
    if (!this.item) {
      return;
    }
    this.item.quantity++;
    this.cartService.updateItem(this.item);
  }

  decreaseQuantity() {
    if (!this.item || this.item.quantity <= 1) return;
    this.item.quantity--;
    this.cartService.updateItem(this.item);
  }

  removeItem() {
    this.cartService.clearCart();
    this.item = null;
  }
}