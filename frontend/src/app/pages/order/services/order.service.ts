import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { environment } from '../../../shared/helpers/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private apiService:ApiService
  ) { }

  getMyOrders(): Observable<any> {
    return this.apiService.get(`${environment.apiUrl}/order/get-orders`);
  }

  createOrder(data: any): Observable<any> {
    return this.apiService.post(`${environment.apiUrl}/order/create-order`, data);
  }
}
