import { TestBed } from '@angular/core/testing';

import { TdoService } from './tdo.service';

describe('TdoService', () => {
  let service: TdoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TdoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
