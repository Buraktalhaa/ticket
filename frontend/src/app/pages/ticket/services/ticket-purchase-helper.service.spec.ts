import { TestBed } from '@angular/core/testing';

import { TicketPurchaseHelperService } from './ticket-purchase-helper.service';

describe('TicketPurchaseHelperService', () => {
  let service: TicketPurchaseHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketPurchaseHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
