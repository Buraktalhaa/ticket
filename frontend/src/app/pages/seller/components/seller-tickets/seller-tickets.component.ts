import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SellerService } from '../../services/seller.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { TicketCardComponent } from '../../../../shared/components/ticket-card/ticket-card.component';
import { TicketFilterComponent } from '../../../../shared/components/ticket-filter/ticket-filter.component';
import { FooterInfoTextComponent } from '../../../../shared/components/footer-info-text/footer-info-text.component';
import { Ticket } from '../../../ticket/types/ticket.types';
import { FilterTicketService } from '../../../../shared/services/filter-ticket.service';
import { HttpResponse } from '@angular/common/http';

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
    private filterTicketService: FilterTicketService
  ) {}

  ngOnInit() {
    this.sellerService.getMyTickets().subscribe((res: HttpResponse<any>) => {
      const data = res.body?.data;
      this.tickets = data;
      this.filteredTickets = [...data];
    });
    this.sellerService.getMyTickets();
  }

  goToEditPage(ticket: Ticket) {
    this.router.navigate(['seller-dashboard/my-tickets/edit'], { state: { ticket } });
  }

  onFilter(filter: { sortBy: string; keyword: string }) {
    this.filteredTickets = this.filterTicketService.filterTickets(this.tickets, filter);
  }
}