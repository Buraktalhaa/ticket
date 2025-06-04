import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../helpers/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(
    private api: ApiService
  ) { }

  getFavorites() {
    return this.api.get(`${environment.apiUrl}/favorite/get-favorites`)
  }

  addFavorite(ticketId: string) {
    return this.api.post(`${environment.apiUrl}/favorite/add-favorite`, { ticketId })
  }

  deleteFavorite(ticketId: string) {
    return this.api.post(`${environment.apiUrl}/favorite/delete-favorite`, { ticketId })
  }
}