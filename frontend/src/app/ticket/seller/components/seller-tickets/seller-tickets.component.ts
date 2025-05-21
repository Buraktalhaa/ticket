import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../../main/shared/components/navbar/navbar.component';
import { TicketCardComponent } from '../../../../shared/components/ticket-card/ticket-card.component';
import { TicketFilterComponent } from '../../../../shared/components/ticket-filter/ticket-filter.component';
import { TicketService } from '../../../shared/services/ticket.service';


@Component({
  selector: 'app-seller-tickets',
  imports: [
    NavbarComponent,
    TicketCardComponent,
    TicketFilterComponent
  ],
  templateUrl: './seller-tickets.component.html',
  styleUrl: './seller-tickets.component.css'
})
export class SellerTicketsComponent {
  tickets: any[] = [];
  filteredTickets: any[] = [];

  constructor(
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit() {
    this.ticketService.sellerTickets$.subscribe(data => {
      this.tickets = data;
      this.filteredTickets = [...data];
      console.log(data)
    });

    this.ticketService.getMyTickets();
  }

  goToEditPage(ticket: any) {
    this.router.navigate(['seller-dashboard/my-tickets/edit'], { state: { ticket } });
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