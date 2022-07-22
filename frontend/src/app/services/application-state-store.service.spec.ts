import { TestBed } from '@angular/core/testing';

import { ApplicationStateStoreService } from './application-state-store.service';

describe('ApplicationStateStoreService', () => {
  let service: ApplicationStateStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationStateStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
