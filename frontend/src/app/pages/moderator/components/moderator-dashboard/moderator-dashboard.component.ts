import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { FooterInfoTextComponent } from '../../../../shared/components/footer-info-text/footer-info-text.component';
import { NotificationService } from '../../../../shared/services/notification.service';
import { ModeratorService } from '../../services/moderator.service';
import { ModeratorNavigationService } from '../../services/moderator-navigation.service';

@Component({
  selector: 'app-moderator-dashboard',
  imports: [
    NavbarComponent,
    FooterInfoTextComponent
  ],
  templateUrl: './moderator-dashboard.component.html',
  styleUrl: './moderator-dashboard.component.css'
})
export class ModeratorDashboardComponent {
  constructor(
    private moderatorService: ModeratorService,
    private moderatorNavigationService: ModeratorNavigationService,
    private notificationService: NotificationService
  ) { }

  goToModeratorStatusPanel() {
    this.moderatorService.getModeratorStatusPanel().subscribe({
      next: () => {
        this.moderatorNavigationService.goToModeratorStatusPanel();
      },
      error: (err) => {
        console.error('Error:', err)
        this.notificationService.showNotification("error", err)
      }
    });
  }
}