import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../main/shared/components/navbar/navbar.component';
import { TicketService } from '../../services/ticket.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../cart/services/cart.service';
import { Ticket } from '../../types/ticket.types';
import { AuthService } from '../../../auth/services/auth.service';
import { HttpResponse } from '@angular/common/http';

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
  ticket: Ticket | null = null;
  ticketCount: number = 1;

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private cartService: CartService,
    public authService: AuthService,
    private router: Router,

  ) {}

  ngOnInit(): void {
    const ticket = this.ticketService.getSelectedTicket();
    console.log(ticket);
    
    if (ticket) {
      this.ticket = ticket;
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      if (id == null) return;
    
      this.ticketService.getTicketById(id).subscribe((res: HttpResponse<any>) => {
        console.log('Ticket API response:', res.body);
        this.ticket = res.body?.data;
        console.log(this.ticket);
        
      });
    } 
  }

  goToSignIn() {
    const currentUrl = this.router.url;
    console.log('Navigating to sign-in from URL:', currentUrl);
    this.router.navigate(['/sign-in'], {
      queryParams: { returnUrl: currentUrl }
    });
  }

  purchaseTicket() {
    if (!this.ticket) return;

    const newItem = {
      ticketId: this.ticket.id,
      count: this.ticketCount
    };
  
    const stock = this.ticket.stock;
  
    if (newItem.count > stock) {
      alert(`There are only ${stock} tickets in stock.`);
      return;
    }
  
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
          const totalCount = existing.count + newItem.count;
  
          if (totalCount > stock) {
            alert(`You can’t add more than ${stock} tickets. You already have ${existing.count} in your cart.`);
            return;
          }
  
          const updatedItem = {
            ticketId: existing.ticket.id,
            count: totalCount
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