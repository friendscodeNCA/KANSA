import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalObtenerUbicacionPage } from './modal-obtener-ubicacion.page';

describe('ModalObtenerUbicacionPage', () => {
  let component: ModalObtenerUbicacionPage;
  let fixture: ComponentFixture<ModalObtenerUbicacionPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalObtenerUbicacionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalObtenerUbicacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
