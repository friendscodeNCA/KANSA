import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalObtenerUbicacionPageRoutingModule } from './modal-obtener-ubicacion-routing.module';

import { ModalObtenerUbicacionPage } from './modal-obtener-ubicacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ModalObtenerUbicacionPageRoutingModule
  ],
  declarations: [],
})
export class ModalObtenerUbicacionPageModule {}
