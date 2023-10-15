import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { usuarioInterface } from 'src/app/models/usuarioInterface';
import { DataApiService } from 'src/app/services/data-api.service';
import { GlobalService } from 'src/app/services/global.service';
import { PasarDatosService } from 'src/app/services/pasar-datos.service';

@Component({
  selector: 'app-lista-usuarios-servicio',
  templateUrl: './lista-usuarios-servicio.page.html',
  styleUrls: ['./lista-usuarios-servicio.page.scss'],
})
export class ListaUsuariosServicioPage implements OnInit {
  idSubcategoria;
  dataSubcategoria;

  listaUsuarios: usuarioInterface[] = [];
  sinDatos = false;
  constructor(
    private pasarDatos: PasarDatosService,
    private route: ActivatedRoute,
    private router: Router,
    private dataApi: DataApiService,
    private globalService: GlobalService
  ) {
    this.idSubcategoria = this.route.snapshot.params.id;
    console.log('id: ', this.idSubcategoria);
   }

  ngOnInit() {
    this.dataSubcategoria = this.pasarDatos.getData();
    console.log('subcategoia: ', this.dataSubcategoria);
    if (!this.dataSubcategoria) {
      this.router.navigate(['/tabs/tab1']);
    }
    setTimeout(() => {
      if (this.dataSubcategoria) {
        this.obtenerUsuariosServicio();
      }
    }, 1000);
  }
  llamar(celular){
    this.globalService.llamarNumero(celular);
  }

  obtenerUsuariosServicio() {
    this.dataApi.busquedaUsuariosServicio([this.dataSubcategoria.nombre]).then(lista => {
      console.log('TENEMOS: ', lista);
      if (lista.length) {
        this.listaUsuarios = lista;
        this.sinDatos = false;
      } else {
        this.listaUsuarios = [];
        this.sinDatos = true;
      }
    });
  }

  irPerfil(usuario){
    this.globalService.goPerfil(usuario);
  }

}
