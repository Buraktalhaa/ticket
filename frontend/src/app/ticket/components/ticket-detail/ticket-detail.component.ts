import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../main/shared/components/navbar/navbar.component';
import { TicketService } from '../../services/ticket.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../cart/services/cart.service';

@Component({
  selector: 'app-ticket-detail',
  imports: [
    NavbarComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent {
  ticket: any;
  ticketCount:number = 1

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private cartService: CartService
  ){}

  ngOnInit() {
    const ticket = this.ticketService.getSelectedTicket();
  
    if (ticket) {
      this.ticket = ticket;
    } else {
      const id = this.route.snapshot.paramMap.get('ticket');
      if(id == null){
        return
      }
      this.ticketService.getTicketById(id).subscribe((data: any) => {
        this.ticket = data.body?.data;
      });      
    }
    console.log(ticket)
  }

  purchaseTicket() {
    const newItem = {
      ticket: this.ticket,
      quantity: this.ticketCount
    };
  
    const existing = this.cartService.getCurrentItem();
  
    if (existing) {
      if (existing.ticket.id !== newItem.ticket.id) {
        const confirmed = confirm(
          `You already have a product "${existing.ticket.title}" in your cart. Do you want to replace it?`
        );
  
        if (confirmed) {
          this.cartService.clearCart();
          this.cartService.addToCart(newItem);
          alert('New item added, old item removed.');
        } else {
          alert('No changes made.');
        }
      } else {
        existing.quantity += this.ticketCount;
        this.cartService.updateItem(existing);
        alert(`Product quantity updated to ${existing.quantity}.`);
      }
    } else {
      this.cartService.addToCart(newItem);
      alert('Product added to the cart.');
    }
  }
  
}