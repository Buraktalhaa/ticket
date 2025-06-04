import { Injectable } from '@angular/core';
import { CartItem, CartUpdatedTo } from '../types/cart-item.types';
import { ApiService } from '../../../shared/services/api.service';
import { map, Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { environment } from '../../../shared/helpers/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private apiService: ApiService,
  ) {}

  getCurrentItem(): Observable<CartItem | null> {
    return this.apiService.get(`${environment.apiUrl}/cart/get-cart`).pipe(
      map((res: HttpResponse<any>) => res.body?.data ?? null)
    );
  }

  addToCart(item: CartUpdatedTo): Observable<any> {
    return this.apiService.post(`${environment.apiUrl}/cart/add-to-cart`, item);
  }

  updateCart(item: CartUpdatedTo): Observable<any> {
    return this.apiService.post(`${environment.apiUrl}/cart/update-cart`, item);
  }

  clearCart(): Observable<any> {
    return this.apiService.delete(`${environment.apiUrl}/cart/delete-cart`);
  }
}