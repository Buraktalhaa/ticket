import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { calculateDiscountedPrice } from '../../helpers/discount.helper';

@Component({
  selector: 'app-ticket-card',
  imports: [CommonModule],
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.css'
})
export class TicketCardComponent {
  @Input() description: string =''
  @Input() stock: number =0
  @Input() buttonText: string = '';
  @Input() price!: number
  @Input() discount!: number
  @Input() imageUrl: string = "/defaultImage.webp";
  
  discountedPrice!:number 
  
  @Output() buttonClick = new EventEmitter<void>();

  ngOnChanges() {
    this.discountedPrice = calculateDiscountedPrice(this.price, this.discount);
  }

  onButtonClick() {
    this.buttonClick.emit();
  }
}