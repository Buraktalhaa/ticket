import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { TicketService } from '../../../ticket/shared/services/ticket.service';
import { TicketFilterComponent } from '../../../shared/components/ticket-filter/ticket-filter.component';
import { TicketCardComponent } from '../../../ticket/shared/components/ticket-card/ticket-card.component';

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

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.ticketService.tickets$.subscribe(data => {
      this.tickets = data;
      this.filteredTickets = [...data];
      console.log(data)
    });

    this.ticketService.allTickets();
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
