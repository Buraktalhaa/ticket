import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../../main/shared/components/navbar/navbar.component';
import { TicketService } from '../../../shared/services/ticket.service';

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
    private ticketService: TicketService) {}

  ngOnInit() {
    const ticket = history.state.ticket;
    console.log(ticket);
    

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

  updateTicket() {
    if (this.ticketForm.valid) {
      const updatedTicket = this.ticketForm.value;
      console.log('Updated ticket:', updatedTicket);
      this.ticketService.editTicket(updatedTicket)
    }
  }
}
