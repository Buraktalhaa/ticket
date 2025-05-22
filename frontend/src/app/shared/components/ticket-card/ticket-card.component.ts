import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-ticket-card',
  imports: [],
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.css'
})
export class TicketCardComponent {
  @Input() description: string =''
  @Input() stock: number =0
  @Input() buttonText: string = '';
  @Output() buttonClick = new EventEmitter<void>();
  @Input() price!: number
  @Input() discount!: number
  @Input() imageUrl: string = "/defaultImage.webp";
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

  onButtonClick() {
    this.buttonClick.emit();
  }
}