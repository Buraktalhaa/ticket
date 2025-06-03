import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../../ticket/services/ticket.service';
import { Ticket } from '../../../ticket/types/ticket.types';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { TicketCardComponent } from '../../../../shared/components/ticket-card/ticket-card.component';
import { TicketFilterComponent } from '../../../../shared/components/ticket-filter/ticket-filter.component';
import { FooterInfoTextComponent } from '../../../../shared/components/footer-info-text/footer-info-text.component';
import { FilterTicketService } from '../../../../shared/services/filter-ticket.service';
import { HttpResponse } from '@angular/common/http';
import { FavoriteService } from '../../../../shared/services/favorite.service';

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
  favorites: string[] = [];
  selectedCategory = '';
  allowedCategories = ['flight', 'train', 'bus', 'hotel', 'movie', 'theater', 'concert'];
  hoveredCardIndex: number | null = null;

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private router: Router,
    private filterTicketService: FilterTicketService,
    private favoriteService: FavoriteService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // favorileri backendden cek
    this.favoriteService.getFavorites();
    // behavior subject e kayit ol
    this.favoriteService.favorites$.subscribe((favorites) => {
      this.favorites = favorites
      console.log(this.favorites);
      this.setFilteredTickets();
    });
    

    this.route.paramMap.subscribe(params => {
      const category = params.get('category');

      // category control
      if (category && this.allowedCategories.includes(category)) {
        this.selectedCategory = category;
        this.ticketService.categoryTickets(category)
          .subscribe((res: HttpResponse<any>) => {
            this.tickets = res.body?.data || [];
            this.setFilteredTickets();
          });

      } else {
        this.selectedCategory = '';
        this.ticketService.allTickets()
          .subscribe((res: HttpResponse<any>) => {
            this.tickets = res.body?.data || [];
            this.setFilteredTickets();
          });
      }
    });
  }

  private setFilteredTickets(): void {
    this.filteredTickets = this.tickets.map(ticket => ({
      ...ticket,
      isFavorite: this.favorites.includes(ticket.id)
    }));
    this.cdr.detectChanges();
  }

  isFavorite(ticketId: string): boolean {
    return this.favorites.includes(ticketId);
  }

  onFavoriteChanged(ticketId: string, isFav: boolean) {
    if (isFav) {
      this.favoriteService.addFavorite(ticketId);
    } else {
      this.favoriteService.deleteFavorite(ticketId);
    }
  }

  goTicketDetailPage(ticket: Ticket) {
    const favorite = this.isFavorite(ticket.id)
    this.ticketService.setSelectedTicket(ticket);
    const category = ticket.category.name;
    this.router.navigate(['/main', category, ticket.id]);
  }

  onFilter(filter: { sortBy: string; keyword: string }) {
    this.filteredTickets = this.filterTicketService.filterTickets(this.tickets, filter);
  }
}