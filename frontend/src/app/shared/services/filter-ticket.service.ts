import { Injectable } from '@angular/core';
import { Ticket } from '../../pages/ticket/types/ticket.types';

@Injectable({
  providedIn: 'root'
})
export class FilterTicketService {
  tickets: Ticket[] = [];

  constructor() { }

  filterTickets(tickets: Ticket[], filter: { sortBy: string; keyword: string }): Ticket[] {
    const keyword = filter.keyword.toLowerCase();

    return tickets
      .filter(ticket =>
        ticket.description?.toLowerCase().includes(keyword)
      )
      .sort((a, b) => {
        switch (filter.sortBy) {
          case 'priceAsc':
            return a.price - b.price;
          case 'priceDesc':
            return b.price - a.price;
          case 'dateNewest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'dateOldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'nameAZ':
            return a.description.localeCompare(b.description);
          case 'nameZA':
            return b.description.localeCompare(a.description);
          default:
            return 0;
        }
      });
  }
}