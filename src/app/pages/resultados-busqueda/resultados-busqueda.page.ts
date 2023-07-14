import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BuscadorService } from 'src/app/services/buscador.service';

@Component({
  selector: 'app-resultados-busqueda',
  templateUrl: './resultados-busqueda.page.html',
  styleUrls: ['./resultados-busqueda.page.scss'],
})
export class ResultadosBusquedaPage implements OnInit {

  target: string;
  listaUsuarios;
  constructor(
    private buscador: BuscadorService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.target = this.route.snapshot.params.target;
    console.log(this.target);
    this.buscar();
  }

  buscar() {
    this.buscador.buscarServicioGeneral(this.target).then(res => {
      console.log('BUSCADOR: ', res);
      if (res.length) {
        this.listaUsuarios = res;
      } else {
        this.listaUsuarios = [];
      }
    })
  }

  buscarGeneral(event) {
    this.buscador.buscarServicioGeneral(event.target.value).then(res => {
      console.log('BUSCADOR DENTRO: ', res);
      if (res.length) {
        this.listaUsuarios = res;
      } else {
        this.listaUsuarios = [];
      }
    })
  }
}
