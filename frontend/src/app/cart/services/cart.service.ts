import { Injectable } from '@angular/core';
import { CartItem, CartUpdatedTo } from '../types/cart-item.types';
import { ApiService } from '../../shared/services/api.service';
import { map, Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItem: CartItem | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  getCurrentItem(): Observable<CartItem | null> {
    return this.apiService.get('http://localhost:3000/cart/get-cart').pipe(
      map((res: HttpResponse<any>) => res.body?.data ?? null)
    );
  }

  addToCart(item: CartUpdatedTo): Observable<any> {
    return this.apiService.post('http://localhost:3000/cart/add-to-cart', item);
  }

  updateItem(item: CartUpdatedTo): Observable<any> {
    return this.apiService.post(`http://localhost:3000/cart/update-cart`, item);
  }

  clearCart(): Observable<any> {
    return this.apiService.delete('http://localhost:3000/cart/delete-cart');
  }

  buy(data: any): Observable<any> {
    return this.apiService.post('http://localhost:3000/order/create-order', data);
  }
  
}
