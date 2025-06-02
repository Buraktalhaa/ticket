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
import { HttpResponse } from '@angular/common/http';

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
    private filterTicketService: FilterTicketService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const category = params.get('category');
      if (category && this.allowedCategories.includes(category)) {
        this.selectedCategory = category;

        this.ticketService.categoryTickets(category).subscribe((res: HttpResponse<any>) => {
          const data = res.body?.data || [];
          this.tickets = data;
          this.filteredTickets = [...data];
        });
      } else {
        this.selectedCategory = '';
        this.ticketService.allTickets().subscribe((res: HttpResponse<any>) => {
          const data = res.body?.data || [];
          this.tickets = data;
          this.filteredTickets = [...data];
        });;
      }
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