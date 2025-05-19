import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-filter',
  imports: [FormsModule],
  templateUrl: './ticket-filter.component.html',
  styleUrl: './ticket-filter.component.css'
})
export class TicketFilterComponent {
  @Output() filterChanged = new EventEmitter<{
    sortBy: string;
    keyword: string;
  }>();

  sortBy: string = '';
  keyword: string = '';

  applyFilter() {
    this.filterChanged.emit({
      sortBy: this.sortBy,
      keyword: this.keyword
    });
  }

  clearFilter() {
    this.sortBy = '';
    this.keyword = '';
    this.applyFilter();
  }
}
