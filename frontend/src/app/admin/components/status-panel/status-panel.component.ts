import { Component } from '@angular/core';
import { NavbarComponent } from '../../../main/shared/components/navbar/navbar.component';
import { TicketCardComponent } from '../../../shared/components/ticket-card/ticket-card.component';
import { TicketFilterComponent } from '../../../shared/components/ticket-filter/ticket-filter.component';
import { FooterInfoTextComponent } from '../../../shared/components/footer-info-text/footer-info-text.component';
import { Ticket } from '../../../ticket/types/ticket.types';
import { AdminService } from '../../services/admin.service';
import { AdminNavigationService } from '../../services/admin-navigation.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-status-panel',
  standalone: true,
  imports: [
    NavbarComponent,
    TicketCardComponent,
    TicketFilterComponent,
    FooterInfoTextComponent,
    CommonModule
  ],
  templateUrl: './status-panel.component.html',
  styleUrl: './status-panel.component.css'
})
export class StatusPanelComponent {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  hoveredCardIndex: number | null = null

  constructor(
    private adminService: AdminService,
    private adminNavigationService: AdminNavigationService
  ) {}

  ngOnInit() {
    this.adminService.getAdminStatusPanel().subscribe({
      next: (res) => {
        const data = res.body?.data || [];
        this.tickets = data;
        this.filteredTickets = [...data];
      },
      error: (err) => console.error('Error:', err)
    });
  }

  goToChangeStatusPage(ticket: Ticket) {
    this.adminNavigationService.goToStatusEditPage(ticket);
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
