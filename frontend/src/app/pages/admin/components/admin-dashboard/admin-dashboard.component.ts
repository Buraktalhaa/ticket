import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdminNavigationService } from '../../services/admin-navigation.service';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { FooterInfoTextComponent } from '../../../../shared/components/footer-info-text/footer-info-text.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    NavbarComponent,
    FooterInfoTextComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  constructor(
    private adminService: AdminService,
    private adminNavigationService: AdminNavigationService
  ){}

  goToAdminStatusPanel() {
    this.adminService.getAdminStatusPanel().subscribe({
      next: (res) => {
        this.adminNavigationService.goToAdminStatusPanel();
      },
      error: (err) => console.error('Error:', err)
    });
  }
}
