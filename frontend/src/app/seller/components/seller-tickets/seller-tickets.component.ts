import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TicketCardComponent } from '../../../shared/components/ticket-card/ticket-card.component';
import { TicketFilterComponent } from '../../../shared/components/ticket-filter/ticket-filter.component';
import { SellerService } from '../../services/seller.service';
import { CommonModule } from '@angular/common';
import { FooterInfoTextComponent } from '../../../shared/components/footer-info-text/footer-info-text.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { Ticket } from '../../../pages/ticket/types/ticket.types';

@Component({
  selector: 'app-seller-tickets',
  imports: [
    NavbarComponent,
    TicketCardComponent,
    TicketFilterComponent,
    CommonModule,
    FooterInfoTextComponent
  ],
  templateUrl: './seller-tickets.component.html',
  styleUrl: './seller-tickets.component.css'
})
export class SellerTicketsComponent {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  hoveredCardIndex: number | null = null

  constructor(
    private router: Router,
    private sellerService: SellerService,
  ) {}

  ngOnInit() {
    this.sellerService.sellerTickets$.subscribe(data => {
      this.tickets = data;
      this.filteredTickets = [...data];
    });
    this.sellerService.getMyTickets();
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