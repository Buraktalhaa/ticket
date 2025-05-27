import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { TicketFilterComponent } from '../../../shared/components/ticket-filter/ticket-filter.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../../ticket/services/ticket.service';
import { FooterInfoTextComponent } from '../../../shared/components/footer-info-text/footer-info-text.component';
import { Ticket } from '../../../ticket/types/ticket.types';
import { TicketCardComponent } from '../../../shared/components/ticket-card/ticket-card.component';
import { CommonModule } from '@angular/common';

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
  allowedCategories = ['Flight', 'Train', 'Bus', 'Hotel', 'Movie', 'Theater', 'Concert'];
  hoveredCardIndex: number | null = null;


  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const category = params.get('category');
      if (category && this.allowedCategories.includes(category)) {
        this.selectedCategory = category;
        this.ticketService.categoryTickets(category);
      } else {
        this.selectedCategory = '';
        this.ticketService.allTickets();
      }
    });

    this.ticketService.tickets$.subscribe(data => {
      this.tickets = data;
      this.filteredTickets = [...data];
    });
  }

  goTicketDetailPage(ticket:Ticket){
    this.ticketService.setSelectedTicket(ticket);
    const category = ticket.category.name;
    this.router.navigate(['/main', category, ticket.id]);
  }

  onFilter(filter: { sortBy: string; keyword: string }) {
    const keyword = filter.keyword.toLowerCase();

    this.filteredTickets = this.tickets
      .filter(ticket =>
        ticket.description?.toLowerCase().includes(keyword)
      )
      .sort((a, b) => {
        switch (filter.sortBy) {
          case 'priceAsc':
            return a.price - b.price;
          case 'priceDesc':
            return b.price - a.price;
          case 'dateNewest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'dateOldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'nameAZ':
            return a.description.localeCompare(b.description);
          case 'nameZA':
            return b.description.localeCompare(a.description);
          default:
            return 0;
        }
      });
  }
}