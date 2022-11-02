import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarEditarCategoriaPage } from './agregar-editar-categoria.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarEditarCategoriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarEditarCategoriaPageRoutingModule {}
