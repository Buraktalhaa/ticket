import { Component } from '@angular/core';
import { NavbarComponent } from '../../../main/shared/components/navbar/navbar.component';
import { LabelsComponent } from '../labels/labels.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../shared/services/ticket.service';

@Component({
  selector: 'app-create-ticket',
  imports: [
    NavbarComponent,
    LabelsComponent,
    FormsModule
  ],
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.css'
})
export class CreateTicketComponent {
  ticket = {
    categoryName: '',
    description: '',
    hour: 0,
    day: '',
    stock: 0,
    price: 0,
    pointRate: 0,
    pointExpiresAt: '',
    discount: 0,
  };

  constructor(private http: HttpClient,
    private ticketServie:TicketService
  ) {}

  categoryOptions = ['Concert', 'Hotel', 'Event', 'Train', 'Bus'];

  createTicket() {
    this.ticketServie.createTicket(this.ticket)
  }
}