import { TestBed } from '@angular/core/testing';

import { VigilanciaService } from './vigilancia.service';

describe('VigilanciaService', () => {
  let service: VigilanciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VigilanciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
