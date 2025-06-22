import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { calculateDiscountedPrice } from '../../helpers/discount.helper';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';
import { CookieService } from 'ngx-cookie-service';

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
  role: string | null = null;
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

  constructor(
    private cookieService: CookieService,
  ) { }

  ngOnInit(): void {
    this.role = this.cookieService.get('role');
  }

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