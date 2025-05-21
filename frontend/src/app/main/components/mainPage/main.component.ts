import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { TicketService } from '../../../ticket/shared/services/ticket.service';
import { TicketFilterComponent } from '../../../shared/components/ticket-filter/ticket-filter.component';
import { TicketCardComponent } from '../../../ticket/shared/components/ticket-card/ticket-card.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [
    NavbarComponent,
    TicketCardComponent,
    TicketFilterComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  tickets: any[] = [];
  filteredTickets: any[] = [];
  selectedCategory = '';
  allowedCategories = ['flight', 'train', 'bus', 'hotel', 'movie', 'theater', 'concert'];


  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute
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
      console.log(data);
    });
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
