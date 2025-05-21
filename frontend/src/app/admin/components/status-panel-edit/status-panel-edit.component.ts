import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../main/shared/components/navbar/navbar.component';
import { ApiService } from '../../../shared/services/api.service';
import { TicketService } from '../../../ticket/shared/services/ticket.service';


@Component({
  selector: 'app-status-panel-edit',
  imports: [
    NavbarComponent,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './status-panel-edit.component.html',
  styleUrl: './status-panel-edit.component.css'
})
export class StatusPanelEditComponent {
  ticketForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    const ticket = history.state.ticket;

    if (!ticket) {
      console.error('No ticket found in state.');
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
      const updatedTicket = {id, status} 
      this.ticketService.editStatus(updatedTicket)
    }
  }
}
