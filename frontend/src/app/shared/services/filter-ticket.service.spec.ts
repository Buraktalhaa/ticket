import { TestBed } from '@angular/core/testing';

import { FilterTicketService } from './filter-ticket.service';

describe('FilterTicketService', () => {
  let service: FilterTicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterTicketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
