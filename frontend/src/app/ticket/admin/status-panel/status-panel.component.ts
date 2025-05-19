import { Component } from '@angular/core';
import { NavbarComponent } from '../../../main/shared/components/navbar/navbar.component';
import { TicketService } from '../../shared/services/ticket.service';
import { TicketCardComponent } from '../../shared/components/ticket-card/ticket-card.component';
import { Router } from '@angular/router';
import { TicketFilterComponent } from '../../../shared/components/ticket-filter/ticket-filter.component';

@Component({
  selector: 'app-status-panel',
  standalone: true,
  imports: [
    NavbarComponent,
    TicketCardComponent,
    TicketFilterComponent
  ],
  templateUrl: './status-panel.component.html',
  styleUrl: './status-panel.component.css'
})
export class StatusPanelComponent {
  tickets: any[] = [];
  filteredTickets: any[] = [];

  constructor(
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit() {
    this.ticketService.adminTickets$.subscribe(data => {
      this.tickets = data;
      this.filteredTickets = [...data];
    });
    this.ticketService.goAdminStatusPanel()
  }

  goToChangeStatusPage(ticket: any) {
    this.router.navigate(['admin/statusPanel/tickets/edit'], { state: { ticket } });
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
