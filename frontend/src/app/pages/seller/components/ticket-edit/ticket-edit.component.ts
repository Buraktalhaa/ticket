import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SellerService } from '../../services/seller.service';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-ticket-edit',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NavbarComponent
  ],
  templateUrl: './ticket-edit.component.html',
  styleUrl: './ticket-edit.component.css'
})
export class TicketEditComponent {
  ticketForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sellerService: SellerService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // window.history
    // router ile yonlendirme yaptigim icin var
    const ticket = history.state.ticket;

    if (!ticket) {
      console.error('No ticket provided');
      return;
    }

    this.ticketForm = this.fb.group({
      id:ticket.id,
      description: [ticket.description || '', Validators.required],
      price: [ticket.price || 0, [Validators.required, Validators.min(0)]],
      stock: [ticket.stock || 0, [Validators.required, Validators.min(0)]],
      discount: [ticket.discount || 0, [Validators.min(0), Validators.max(100)]]
      // TODO: edit edilebilir  olanlardan eklenecekler var ekle
    });
  }

  editTicket() {
    if (this.ticketForm.valid) {
      const updatedTicket = this.ticketForm.value;

      this.sellerService.editTicket(updatedTicket).subscribe({
        next: () => {
          this.notificationService.success("Ticket updated successfully");
          this.router.navigateByUrl('seller-dashboard/my-tickets');
        },
        error: () => {
          this.notificationService.error("Failed to update the ticket.");
        }
      });
    }
  }
}