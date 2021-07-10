import { TestBed } from '@angular/core/testing';

import { GetPlannedTimeService } from './get-planned-time.service';

describe('GetPlannedTimeService', () => {
  let service: GetPlannedTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetPlannedTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
