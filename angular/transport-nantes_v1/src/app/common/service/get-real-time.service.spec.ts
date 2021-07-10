import { TestBed } from '@angular/core/testing';

import { GetRealTimeService } from './get-real-time.service';

describe('GetRealTimeService', () => {
  let service: GetRealTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetRealTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
