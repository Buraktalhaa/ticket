import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../main/shared/components/navbar/navbar.component';
import { TicketService } from '../../../shared/services/ticket.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ticket-detail',
  imports: [
    NavbarComponent
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent {
  ticket: any;

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute
  ){}

  ngOnInit() {
    const ticket = this.ticketService.getSelectedTicket();
  
    if (ticket) {
      this.ticket = ticket;
    } else {
      const id = this.route.snapshot.paramMap.get('ticket');
      if(id == null){
        return
      }
      this.ticketService.getTicketById(id).subscribe((data: any) => {
        this.ticket = data.body?.data;
      });      
    }
    console.log(ticket)
  }

}
