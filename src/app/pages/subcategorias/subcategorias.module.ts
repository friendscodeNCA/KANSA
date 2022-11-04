import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubcategoriasPageRoutingModule } from './subcategorias-routing.module';

import { SubcategoriasPage } from './subcategorias.page';
import { ComponentModule } from 'src/app/components/component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SubcategoriasPageRoutingModule,
    ComponentModule
  ],
  declarations: [SubcategoriasPage]
})
export class SubcategoriasPageModule {}
