import { TestBed } from '@angular/core/testing';

import { IrHomeGuard } from './ir-home.guard';

describe('IrHomeGuard', () => {
  let guard: IrHomeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IrHomeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
