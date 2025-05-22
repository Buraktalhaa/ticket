import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../types/order.types';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../main/shared/components/navbar/navbar.component';

@Component({
  selector: 'app-my-orders',
  imports: [
    CommonModule,
    NavbarComponent
  ],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent {
  orders: Order[] = [];
  constructor(
    private orderService:OrderService
  ){}
  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe(res => {
      this.orders = res.body.data
    }) 
  }
}