import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { FooterInfoTextComponent } from '../../../../shared/components/footer-info-text/footer-info-text.component';
import { CommonModule } from '@angular/common';
import { ModeratorService } from '../../services/moderator.service';
import { ModeratorNavigationService } from '../../services/moderator-navigation.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-moderator-status-edit',
  imports: [
    NavbarComponent,
    FooterInfoTextComponent,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './moderator-status-edit.component.html',
  styleUrl: './moderator-status-edit.component.css'
})
export class ModeratorStatusEditComponent {
  ticketForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private moderatorService: ModeratorService,
    private moderatorNavigationService: ModeratorNavigationService,
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
  
      this.moderatorService.editStatus(updatedTicket).subscribe({
        next: () => {
          this.notificationService.showNotification("success", "Ticket edited successfully");
          this.moderatorNavigationService.goToModeratorStatusPanel()
        },
        error: () => {
          this.notificationService.showNotification("error", "Something went wrong");
        }
      });
    }
  }
}