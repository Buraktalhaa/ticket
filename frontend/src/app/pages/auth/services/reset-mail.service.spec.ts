import { TestBed } from '@angular/core/testing';

import { ResetMailService } from './reset-mail.service';

describe('ResetMailService', () => {
  let service: ResetMailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResetMailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
