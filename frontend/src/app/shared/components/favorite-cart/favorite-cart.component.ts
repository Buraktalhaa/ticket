import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from '../../../pages/ticket/types/ticket.types';
import { CommonModule } from '@angular/common';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';

@Component({
  selector: 'app-favorite-cart',
  imports: [
    CommonModule,
    FavoriteButtonComponent
  ],
  templateUrl: './favorite-cart.component.html',
  styleUrl: './favorite-cart.component.css'
})
export class FavoriteCartComponent {
  @Input() ticket!: Ticket;
  @Input() isFavorite: boolean = false;

  @Output() buttonClick = new EventEmitter<void>();
  @Output() favoriteChanged = new EventEmitter<boolean>();

  onButtonClick() {
    this.buttonClick.emit();
  }

  onFavoriteChanged(newValue: boolean) {
    // parent a yolla
    this.favoriteChanged.emit(newValue);
  }

}