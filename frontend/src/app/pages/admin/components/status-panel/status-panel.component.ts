import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdminNavigationService } from '../../services/admin-navigation.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { TicketCardComponent } from '../../../../shared/components/ticket-card/ticket-card.component';
import { TicketFilterComponent } from '../../../../shared/components/ticket-filter/ticket-filter.component';
import { FooterInfoTextComponent } from '../../../../shared/components/footer-info-text/footer-info-text.component';
import { Ticket } from '../../../ticket/types/ticket.types';
import { FilterTicketService } from '../../../../shared/services/filter-ticket.service';

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
    private adminNavigationService: AdminNavigationService,
    private filterTicketService: FilterTicketService
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
    this.filteredTickets = this.filterTicketService.filterTickets(this.tickets, filter);
  }
}