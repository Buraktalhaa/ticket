import { TestBed } from '@angular/core/testing';

import { ModeratorNavigationService } from './moderator-navigation.service';

describe('ModeratorNavigationService', () => {
  let service: ModeratorNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModeratorNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
