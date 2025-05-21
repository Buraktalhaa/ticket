import { Component } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LabelsComponent } from '../labels/labels.component';
import { NavbarComponent } from '../../../main/shared/components/navbar/navbar.component';
import { TicketService } from '../../../ticket/services/ticket.service';
import { FooterInfoTextComponent } from '../../../shared/components/footer-info-text/footer-info-text.component';

@Component({
  selector: 'app-create-ticket',
  imports: [
    NavbarComponent,
    LabelsComponent,
    FormsModule,
    FooterInfoTextComponent
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