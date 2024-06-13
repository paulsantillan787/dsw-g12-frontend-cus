import { TestBed, async, inject } from '@angular/core/testing';
import { EstudianteService } from './estudiante.service';

describe('Service: Estudiante', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EstudianteService]
    });
  });

  it('should be created', inject([EstudianteService], (service: EstudianteService) => {
    expect(service).toBeTruthy();
  }));
});
