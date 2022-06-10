import { TestBed } from '@angular/core/testing';

import { HomePageDataStoreService } from './home-page-data-store.service';

describe('HomePageDataStoreService', () => {
  let service: HomePageDataStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomePageDataStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
