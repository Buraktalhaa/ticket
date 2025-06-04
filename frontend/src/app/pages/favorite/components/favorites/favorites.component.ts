import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { FavoriteService } from '../../../../shared/services/favorite.service';
import { Ticket } from '../../../ticket/types/ticket.types';
import { HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorites',
  imports: [
    NavbarComponent,
    CommonModule
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  tickets: Ticket[] = [];

  constructor(
    private favoriteService: FavoriteService,
  ) { }

  ngOnInit(): void {
    this.favoriteService.getFavorites().subscribe((res: HttpResponse<any>) => {
      this.tickets = res.body.data.map((item: any) => item.ticket);
      console.log(this.tickets);
    });
  }
}