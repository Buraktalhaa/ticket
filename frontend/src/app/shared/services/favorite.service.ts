import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(
    private api: ApiService
  ) { }

  getFavorites() {
    return this.api.get('http://localhost:3000/favorite/get-favorites');
  }

  addFavorite(ticketId: string) {
    console.log(ticketId);
    return this.api.post('http://localhost:3000/favorite/add-favorite', {ticketId} );
  }

  removeFavorite(ticketId: string) {
    return this.api.post(`http://localhost:3000/favorite/delete-favorite`, {ticketId} );
  }
}