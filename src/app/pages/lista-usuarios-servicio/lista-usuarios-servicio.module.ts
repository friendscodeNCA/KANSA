import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaUsuariosServicioPageRoutingModule } from './lista-usuarios-servicio-routing.module';

import { ListaUsuariosServicioPage } from './lista-usuarios-servicio.page';
import { ComponentModule } from 'src/app/components/component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaUsuariosServicioPageRoutingModule,
    ComponentModule
  ],
  declarations: [ListaUsuariosServicioPage]
})
export class ListaUsuariosServicioPageModule {}
