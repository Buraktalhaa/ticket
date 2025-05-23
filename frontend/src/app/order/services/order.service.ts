import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private apiService:ApiService
  ) { }

  getMyOrders(): Observable<any> {
    return this.apiService.get(`http://localhost:3000/order/get-orders`);
  }

  buy(data: any): Observable<any> {
    return this.apiService.post('http://localhost:3000/order/create-order', data);
  }
}
