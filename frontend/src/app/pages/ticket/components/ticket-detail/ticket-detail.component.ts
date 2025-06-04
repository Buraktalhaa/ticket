import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { AuthService } from '../../../auth/services/auth.service';
import { calculateDiscountedPrice } from '../../../../shared/helpers/discount.helper';
import { FavoriteButtonComponent } from '../../../../shared/components/favorite-button/favorite-button.component';
import { FavoriteService } from '../../../../shared/services/favorite.service';
import { Subscription } from 'rxjs';
import { TicketPurchaseHelperService } from '../../services/ticket-purchase-helper.service';
import { Ticket } from '../../types/ticket.types';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-ticket-detail',
  imports: [
    NavbarComponent,
    FormsModule,
    CommonModule,
    FavoriteButtonComponent
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent {
  role: string = ''
  ticket: Ticket | null = null;
  ticketCount: number = 1;
  currentImageIndex = 0;
  discountedPrice = 0
  favoritesList: string[] = [];

  private favoritesSubscription: Subscription | null = null;

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private router: Router,
    // To access this service in the HTML/template
    public authService: AuthService,
    private favoriteService: FavoriteService,
    private ticketPurchaseService: TicketPurchaseHelperService,
    private cookieService: CookieService,
  ) { }

  ngOnInit(): void {
    this.role = this.cookieService.get('role');
    const ticket = this.ticketService.getSelectedTicket();

    if (ticket) {
      this.ticket = ticket;
      this.discountedPrice = calculateDiscountedPrice(ticket.price, ticket.discount);
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      if (id == null) {
        return;
      }

      this.ticketService.getTicketById(id).subscribe((res: HttpResponse<any>) => {
        this.ticket = res.body?.data;
        if (this.ticket) {
          this.discountedPrice = calculateDiscountedPrice(this.ticket.price, this.ticket.discount);
        }
      });
    }
  }


  onToggleFavorite(ticketId: string, newValue: boolean) {
    if (newValue) {
      this.favoriteService.addFavorite(ticketId).subscribe({
        next: () => {
          if (this.ticket && this.ticket.id === ticketId) {
            this.ticket.isFavorite = true;
          }
        },
        error: (err: HttpErrorResponse) => console.error('Error:', err)
      });
    } else {
      this.favoriteService.deleteFavorite(ticketId).subscribe({
        next: () => {
          if (this.ticket && this.ticket.id === ticketId) {
            this.ticket.isFavorite = false;
          }
        },
        error: (err: HttpErrorResponse) => console.error('Error:', err)
      });
    }
  }
  

  purchaseTicket() {
    if (!this.ticket) return;
    this.ticketPurchaseService.purchaseTicket(this.ticket, this.ticketCount)
  }

  changeImage(index: number): void {
    this.currentImageIndex = index;
  }

  goToSignIn() {
    const currentUrl = this.router.url;
    console.log('Navigating to sign-in from URL:', currentUrl);
    this.router.navigate(['/sign-in'], {
      queryParams: { returnUrl: currentUrl }
    });
  }

  ngOnDestroy(): void {
    if (this.favoritesSubscription) {
      this.favoritesSubscription.unsubscribe();
    }
  }
}