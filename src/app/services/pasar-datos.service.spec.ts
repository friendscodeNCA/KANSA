import { TestBed } from '@angular/core/testing';

import { PasarDatosService } from './pasar-datos.service';

describe('PasarDatosService', () => {
  let service: PasarDatosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasarDatosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
