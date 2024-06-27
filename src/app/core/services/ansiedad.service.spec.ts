import { TestBed } from '@angular/core/testing';

import { AnsiedadService } from './ansiedad.service';

describe('AnsiedadService', () => {
  let service: AnsiedadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnsiedadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
