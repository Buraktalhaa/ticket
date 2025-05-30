import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AdminNavigationService } from '../../services/admin-navigation.service';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { FooterInfoTextComponent } from '../../../../shared/components/footer-info-text/footer-info-text.component';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-status-panel-edit',
  imports: [
    NavbarComponent,
    CommonModule,
    ReactiveFormsModule,
    FooterInfoTextComponent
  ],
  templateUrl: './status-panel-edit.component.html',
  styleUrl: './status-panel-edit.component.css'
})
export class StatusPanelEditComponent {
  ticketForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private adminService: AdminService,
    private adminNavigationService: AdminNavigationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    const ticket = history.state.ticket;

    if (!ticket) {
      this.notificationService.showNotification("error", "No ticket found in state");
      this.router.navigate(['/admin-dashboard/status-panel']);
      return;
    }

    this.ticketForm = this.fb.group({
      id: [ticket.id], 
      description: [{ value: ticket.description, disabled: true }],
      stock: [{ value: ticket.stock, disabled: true }],
      price: [{ value: ticket.price, disabled: true }],
      discount: [{ value: ticket.discount, disabled: true }],
      status: [ticket.status || '', Validators.required]
    });
  }

  updateStatus(){
    if (this.ticketForm.valid) {
      const { id, status } = this.ticketForm.value;
      const updatedTicket = { id, status };
  
      this.adminService.editStatus(updatedTicket).subscribe({
        next: () => {
          this.notificationService.showNotification("success", "Ticket edited successfully");
          this.adminNavigationService.goToAdminStatusPanel()
        },
        error: () => {
          this.notificationService.showNotification("error", "Something went wrong");
        }
      });
    }
  }
}