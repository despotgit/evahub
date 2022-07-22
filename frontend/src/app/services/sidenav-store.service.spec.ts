import { TestBed } from '@angular/core/testing';

import { SidenavStoreService } from './sidenav-store.service';

describe('SidenavStoreService', () => {
  let service: SidenavStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidenavStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
