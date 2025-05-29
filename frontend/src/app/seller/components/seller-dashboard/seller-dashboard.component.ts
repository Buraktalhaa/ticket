import { Component } from '@angular/core';
import { FooterInfoTextComponent } from '../../../shared/components/footer-info-text/footer-info-text.component';
import { SellerService } from '../../services/seller.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-seller-dashboard',
  imports: [
    NavbarComponent,
    FooterInfoTextComponent
  ],
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.css'
})
export class SellerDashboardComponent {
  constructor(
    private sellerService: SellerService
  ){

  }
  createTicket(){
    this.sellerService.isSeller()
  }

  myTickets(){
    this.sellerService.getMyTickets()
  }
}
