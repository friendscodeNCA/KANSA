import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalObtenerUbicacionPage } from './modal-obtener-ubicacion.page';

const routes: Routes = [
  {
    path: '',
    component: ModalObtenerUbicacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalObtenerUbicacionPageRoutingModule {}
