import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaUsuariosServicioPage } from './lista-usuarios-servicio.page';

const routes: Routes = [
  {
    path: '',
    component: ListaUsuariosServicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaUsuariosServicioPageRoutingModule {}
