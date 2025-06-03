import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private _favorites$ = new BehaviorSubject<string[]>([]);
  public favorites$ = this._favorites$.asObservable();
  
  constructor(
    private api: ApiService
  ) { }

  getFavorites() {
    this.api.get('http://localhost:3000/favorite/get-favorites').subscribe((res:HttpResponse<any>) => {
      const favoriteObjs = res.body.data
      // tum favorileri ekledik
      const ticketIds = favoriteObjs.map((fav: {ticketId: string}) => fav.ticketId);
      this._favorites$.next(ticketIds);
    });
  }

  addFavorite(ticketId: string) {
    this.api.post('http://localhost:3000/favorite/add-favorite', { ticketId }).subscribe(() => {
      const current = this._favorites$.value;
      // ticketId yi ekledik
      this._favorites$.next([...current, ticketId]);
    });
  }

  deleteFavorite(ticketId: string) {
    this.api.post('http://localhost:3000/favorite/delete-favorite', { ticketId }).subscribe(() => {
      const current = this._favorites$.value.filter(id => id !== ticketId);
      this._favorites$.next(current);
    });
  }

  isFavorite(ticketId: string): boolean {
    return this._favorites$.value.includes(ticketId);
  } 
}