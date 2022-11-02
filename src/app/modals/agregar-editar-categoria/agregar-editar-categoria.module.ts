import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarEditarCategoriaPageRoutingModule } from './agregar-editar-categoria-routing.module';

import { AgregarEditarCategoriaPage } from './agregar-editar-categoria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarEditarCategoriaPageRoutingModule
  ],
  declarations: [AgregarEditarCategoriaPage]
})
export class AgregarEditarCategoriaPageModule {}
