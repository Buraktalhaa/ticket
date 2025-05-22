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
  ticketCount: number = 1;

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const ticket = this.ticketService.getSelectedTicket();

    if (ticket) {
      this.ticket = ticket;
    } else {
      const id = this.route.snapshot.paramMap.get('ticket');
      if (id == null) return;
    
      this.ticketService.getTicketById(id).subscribe((res: any) => {
        this.ticket = res.body?.data;
      });
    }    
  }

  purchaseTicket() {
    const newItem = {
      ticketId: this.ticket.id,
      count: this.ticketCount
    };

    this.cartService.getCurrentItem().subscribe(existing => {
      if (existing) {
        if (existing.ticket.id !== newItem.ticketId) {
          const confirmed = confirm(
            `You already have a product "${existing.ticket.title}" in your cart. Do you want to replace it?`
          );

          if (confirmed) {
            this.cartService.clearCart().subscribe(() => {
              this.cartService.addToCart(newItem).subscribe(() => {
                alert('New item added, old item removed.');
              });
            });
          } else {
            alert('No changes made.');
          }
        } else {
          const updatedItem = {
            ticketId: existing.ticket.id,
            count: existing.count + this.ticketCount
          };
          this.cartService.updateItem(updatedItem).subscribe(() => {
            alert(`Product count updated to ${updatedItem.count}.`);
          });
        }
      } else {
        this.cartService.addToCart(newItem).subscribe(() => {
          alert('Product added to the cart.');
        });
      }
    });
  }
}