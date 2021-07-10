import { TestBed } from '@angular/core/testing';

import { GetlstlieuxService } from './getlstlieux.service';

describe('GetlstlieuxService', () => {
  let service: GetlstlieuxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetlstlieuxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
