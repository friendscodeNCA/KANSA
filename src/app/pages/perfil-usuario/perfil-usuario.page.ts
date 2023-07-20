import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { usuarioInterface } from 'src/app/models/usuarioInterface';
import { DataApiService } from 'src/app/services/data-api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
})
export class PerfilUsuarioPage implements OnInit {

  usuario: usuarioInterface;
  idUsuario: string;
  constructor(
    private dataApi: DataApiService,
    private route: ActivatedRoute,
    private servGlobal: GlobalService
  ) { }

  ngOnInit() {
    this.idUsuario = this.route.snapshot.params.id;
    this.obtenerUsuario();
  }

  obtenerUsuario() {
    this.dataApi.obtenerUnUsuario(this.idUsuario).subscribe(data => {
      console.log(data);
      if (data) {
        this.usuario = data;
      }
    })
  }

  aunNO() {
    this.servGlobal.presentToast('No disponible');
  }

}
