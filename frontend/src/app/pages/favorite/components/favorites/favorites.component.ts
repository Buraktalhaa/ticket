import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { FavoriteService } from '../../../../shared/services/favorite.service';
import { Ticket } from '../../../ticket/types/ticket.types';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FilterTicketService } from '../../../../shared/services/filter-ticket.service';
import { FavoriteCartComponent } from '../../../../shared/components/favorite-cart/favorite-cart.component';
import { FooterInfoTextComponent } from '../../../../shared/components/footer-info-text/footer-info-text.component';

@Component({
  selector: 'app-favorites',
  imports: [
    NavbarComponent,
    CommonModule,
    FavoriteCartComponent,
    FooterInfoTextComponent
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];

  constructor(
    private favoriteService: FavoriteService,
    private filterTicketService: FilterTicketService,
  ) { }

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoriteService.getFavorites().subscribe((res: HttpResponse<any>) => {
      this.tickets = res.body.data.map((item: any) => ({
        ...item.ticket,
        isFavorite: item.isFavorite
      }));
      this.filteredTickets = [...this.tickets];
    });
  }
  

  onFavoriteChanged(ticketId: string, isFav: boolean): void {
    if (isFav) {
      this.favoriteService.addFavorite(ticketId).subscribe({
        next: () => console.log('Added to favorites'),
        error: (err: HttpErrorResponse) => console.error('Error:', err)
      });

    } else {
      this.favoriteService.deleteFavorite(ticketId).subscribe({
        next: () => {
          console.log('Removed from favorites');

          this.tickets = this.tickets.filter(ticket => ticket.id !== ticketId);
          this.filteredTickets = this.filteredTickets.filter(ticket => ticket.id !== ticketId);
        },
        error: (err: HttpErrorResponse) => console.error('Error:', err)
      });
    }
  }

  onFilter(filter: { sortBy: string; keyword: string }) {
    this.filteredTickets = this.filterTicketService.filterTickets(this.tickets, filter);
  }
}