import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { usuarioInterface } from 'src/app/models/usuarioInterface';
import { ChatService } from 'src/app/services/chat.service';
import { DataApiService } from 'src/app/services/data-api.service';
import { GlobalService } from 'src/app/services/global.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
})
export class PerfilUsuarioPage implements OnInit {

  usuario: usuarioInterface;
  idUsuario: string;
  favorito = false;
  constructor(
    private router: Router,
    private chatService: ChatService,
    private dataApi: DataApiService,
    private route: ActivatedRoute,
    private servGlobal: GlobalService,
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.idUsuario = this.route.snapshot.params.id;
    this.consultaFavoritos();
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

  async startChat(item) {
    try {
      // this.global.showLoader();
      // create chatroom
      const room = await this.chatService.createChatRoom(item?.celular);
      console.log('room: ', room);
      //this.cancel();
      const navData: NavigationExtras = {
        queryParams: {
          name: item?.nombres//enviar nombre de usuario
        }
      };
      this.router.navigate(['tabs','tab3', 'chats', room?.id], navData);
      // this.global.hideLoader();
    } catch(e) {
      console.log(e);
      // this.global.hideLoader();
    }
  }

  addFavoritos() {
    if (this.storage.datosUsuario && this.usuario) {
      this.dataApi.agregarFavoritos(this.storage.datosUsuario.id, this.usuario);
    }
  }

  consultaFavoritos() {
    this.favorito = false;
    this.dataApi.obtenerFavorito(this.storage.datosUsuario.id, this.idUsuario).subscribe(data => {
      console.log(data);
      if (data) {
        this.favorito = true;
      }
    })
  }

}
