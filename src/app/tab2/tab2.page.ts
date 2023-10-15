import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { DataApiService } from '../services/data-api.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  id = this.storage.datosUsuario?.id.toString();
  listaUsuarios = [];
  seleccionado = 'favoritos';
  constructor(
    private router: Router,
    private globalService: GlobalService,
    private dataApi: DataApiService,
    private storage: StorageService
  ) {}

  ngOnInit() {
    this.listarFavoritos();
  }

  ChangeList(nuevo) {
    if (nuevo==this.seleccionado) {
      return;
    };
    this.seleccionado = nuevo;
    if (this.seleccionado == 'favoritos') { 
      this.listarFavoritos();
    } else {
      this.listarHistorial();
    }
  }

  listarHistorial() {
    if (this.storage.datosUsuario) {
      this.dataApi.obtenerListaHistorial(this.storage.datosUsuario.id).subscribe(res => {
        console.log('LISTA: ', res);
        if (res.length) {
          this.listaUsuarios = res;
        } else {
          this.listaUsuarios = [];
        }
      });
    }    
  }
  

  listarFavoritos() {
    if (this.storage.datosUsuario) {
      this.dataApi.obtenerListaFavoritos(this.storage.datosUsuario.id).subscribe(res => {
        console.log('LISTA: ', res);
        if (res.length) {
          this.listaUsuarios = res;
        } else {
          this.listaUsuarios = [];
        }
      });
    }    
  }

  irPerfil(usuario){
    this.globalService.goPerfil(usuario);
  }

  eliminarFavHistorial(id) {
    this.dataApi.eliminarFavoritosHistorial(this.seleccionado, this.storage.datosUsuario.id, id).then(res => {
      console.log('Eliminado', res);
      if (res == 'exito') {
        this.globalService.presentToast('Eliminado correctamente');
      }
    })
  }
}
