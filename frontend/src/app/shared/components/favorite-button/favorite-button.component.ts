import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-favorite-button',
  imports: [
    CommonModule
  ],
  templateUrl: './favorite-button.component.html',
  styleUrl: './favorite-button.component.css'
})
export class FavoriteButtonComponent {
  @Input() ticketId!: string;
  @Input() isFavorite: boolean = false;
  @Output() favoriteChange = new EventEmitter<boolean>();

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.favoriteChange.emit(!this.isFavorite);
  }
}