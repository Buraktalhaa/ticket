import { Injectable } from '@angular/core';
import { CartItem } from '../types/cart-item.types';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItem: CartItem | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private saveToStorage() {
    if (this.cartItem) {
      localStorage.setItem('cartItem', JSON.stringify(this.cartItem));
    } else {
      localStorage.removeItem('cartItem');
    }
  }

  private loadFromStorage() {
    const item = localStorage.getItem('cartItem');
    if (item) {
      this.cartItem = JSON.parse(item);
    }
  }

  getCurrentItem(): CartItem | null {
    return this.cartItem;
  }

  addToCart(item: CartItem) {
    console.log(item)
    this.cartItem = item ;
    console.log(this.cartItem)
    this.saveToStorage();
  }

  updateItem(item: CartItem) {
    if (!this.cartItem || this.cartItem.ticket.id !== item.ticket.id) {
      throw new Error('Güncellenecek ürün sepette yok ya da farklı ürün');
    }
    this.cartItem = { ...item };
    this.saveToStorage();
  }

  clearCart() {
    console.log("1",this.cartItem)
    this.cartItem = null;
    console.log("2",this.cartItem)
    this.saveToStorage();
  }
}
