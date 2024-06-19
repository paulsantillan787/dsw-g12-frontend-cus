import { TestBed } from '@angular/core/testing';

import { TipoTestService } from './tipo-test.service';

describe('TipoTestService', () => {
  let service: TipoTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
