import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-ticket-card',
  imports: [],
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.css'
})
export class TicketCardComponent {
  @Input() description: string =''
  @Input() stock: string =''
  @Input() price!: number
  @Input() discount!: number
  discountedPrice!:number 

  ngOnChanges(changes: SimpleChanges) {
    this.calculateDiscountedPrice();
  }

  calculateDiscountedPrice() {
    if (this.discount && this.price ) {
      this.discountedPrice = this.price * (1 - this.discount / 100);
    } else {
      this.discountedPrice = this.price;
    }
  }
}
