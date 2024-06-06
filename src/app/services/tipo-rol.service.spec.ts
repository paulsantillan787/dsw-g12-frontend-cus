import { TestBed } from '@angular/core/testing';

import { TipoRolService } from './tipo-rol.service';

describe('TipoRolService', () => {
  let service: TipoRolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoRolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
