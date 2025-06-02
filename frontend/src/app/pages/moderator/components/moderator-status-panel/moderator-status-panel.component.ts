import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FooterInfoTextComponent } from '../../../../shared/components/footer-info-text/footer-info-text.component';
import { ModeratorService } from '../../services/moderator.service';
import { ModeratorNavigationService } from '../../services/moderator-navigation.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Ticket } from '../../../ticket/types/ticket.types';
import { FilterTicketService } from '../../../../shared/services/filter-ticket.service';
import { TicketCardComponent } from '../../../../shared/components/ticket-card/ticket-card.component';
import { TicketFilterComponent } from '../../../../shared/components/ticket-filter/ticket-filter.component';

@Component({
  selector: 'app-moderator-status-panel',
  imports: [
    NavbarComponent,
    TicketCardComponent,
    TicketFilterComponent,
    CommonModule,
    FooterInfoTextComponent
  ],
  templateUrl: './moderator-status-panel.component.html',
  styleUrl: './moderator-status-panel.component.css'
})
export class ModeratorStatusPanelComponent {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  hoveredCardIndex: number | null = null

  constructor(
    private moderatorService: ModeratorService,
    private moderatorNavigationService: ModeratorNavigationService,
    private filterTicketService: FilterTicketService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.moderatorService.getModeratorStatusPanel().subscribe({
      next: (res) => {
        const data = res.body?.data || [];
        this.tickets = data;
        this.filteredTickets = [...data];
      },
      error: (err) => {
        console.error('Error:', err)
        this.notificationService.showNotification("error", "Failed to load tickets. Please try again.")
      }
    });
  }

  goToChangeStatusPage(ticket: Ticket) {
    this.moderatorNavigationService.goToStatusEditPage(ticket);
  }

  onFilter(filter: { sortBy: string; keyword: string }) {
    this.filteredTickets = this.filterTicketService.filterTickets(this.tickets, filter);
  }
}