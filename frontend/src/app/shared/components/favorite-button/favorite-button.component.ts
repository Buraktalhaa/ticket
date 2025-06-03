import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-favorite-button',
  imports: [],
  templateUrl: './favorite-button.component.html',
  styleUrl: './favorite-button.component.css'
})
export class FavoriteButtonComponent {
  @Input() ticketId!: string;
  @Input() isFavorite: boolean = false;
  @Output() favoriteChanged = new EventEmitter<boolean>();

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.favoriteChanged.emit(!this.isFavorite);
  }
}