import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../../ticket/services/ticket.service';
import { Ticket } from '../../../ticket/types/ticket.types';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { TicketCardComponent } from '../../../../shared/components/ticket-card/ticket-card.component';
import { TicketFilterComponent } from '../../../../shared/components/ticket-filter/ticket-filter.component';
import { FooterInfoTextComponent } from '../../../../shared/components/footer-info-text/footer-info-text.component';
import { FilterTicketService } from '../../../../shared/services/filter-ticket.service';
import { FavoriteService } from '../../../../shared/services/favorite.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-main',
  imports: [
    NavbarComponent,
    TicketCardComponent,
    TicketFilterComponent,
    FooterInfoTextComponent,
    CommonModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  selectedCategory = '';
  allowedCategories = ['flight', 'train', 'bus', 'hotel', 'movie', 'theater', 'concert'];
  hoveredCardIndex: number | null = null;

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private router: Router,
    private filterTicketService: FilterTicketService,
    private favoriteService: FavoriteService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const category = params.get('category');

      // category control
      if (category && this.allowedCategories.includes(category)) {
        this.selectedCategory = category;
        this.ticketService.categoryTickets(category)
          .subscribe((res: HttpResponse<any>) => {
            this.tickets = res.body?.data || [];
            this.filteredTickets = [...this.tickets];
          });
      } else {
        this.selectedCategory = '';
        this.ticketService.allTickets()
          .subscribe((res: HttpResponse<any>) => {
            this.tickets = res.body?.data || [];
            this.filteredTickets = [...this.tickets];
          });
      }
    });
  }


  onFavoriteChanged(ticketId: string, isFav: boolean) {
    if (isFav) {
      this.favoriteService.addFavorite(ticketId).subscribe({
        next: () => console.log('Added from favorites'),
        error: (err: HttpErrorResponse) => console.error('Error:', err)
      });

    } else {
      this.favoriteService.deleteFavorite(ticketId).subscribe({
        next: () => console.log('Removed from favorites'),
        error: (err: HttpErrorResponse) => console.error('Error:', err)
      });
    }

    this.filteredTickets = this.filteredTickets.map(item => {
      if (item.id === ticketId) {
        return { ...item, isFavorite: isFav };
      }
      return item;
    });
  }

  goTicketDetailPage(ticket: Ticket) {
    this.ticketService.setSelectedTicket(ticket);
    const category = ticket.category.name;
    this.router.navigate(['/main', category, ticket.id]);
  }

  onFilter(filter: { sortBy: string; keyword: string }) {
    this.filteredTickets = this.filterTicketService.filterTickets(this.tickets, filter);
  }
}