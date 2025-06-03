import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { calculateDiscountedPrice } from '../../helpers/discount.helper';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';

@Component({
  selector: 'app-ticket-card',
  imports: [
    CommonModule,
    FavoriteButtonComponent
  ],
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.css'
})
export class TicketCardComponent {
  @Input() description: string = ''
  @Input() stock: number = 0
  @Input() buttonText: string = '';
  @Input() price!: number
  @Input() discount!: number
  @Input() imageUrl: string = "/defaultImage.webp";
  @Input() ticketId!: string;
  
  @Output() buttonClick = new EventEmitter<void>();

  @Input() isFavorite: boolean = false;
  @Output() favoriteChanged = new EventEmitter<boolean>();

  discountedPrice!: number

  ngOnChanges() {
    this.discountedPrice = calculateDiscountedPrice(this.price, this.discount);
  }
  onButtonClick() {
    this.buttonClick.emit();
  }

  onFavoriteChanged(newValue: boolean) {
    this.favoriteChanged.emit(newValue);
  }
}