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
  comentario = '';
  listaComentarios = [];
  constructor(
    private router: Router,
    private chatService: ChatService,
    private dataApi: DataApiService,
    private route: ActivatedRoute,
    private servGlobal: GlobalService,
    public storage: StorageService,
  ) { }

  ngOnInit() {
    this.idUsuario = this.route.snapshot.params.id;
    if (this.storage.datosUsuario) {
      this.consultaFavoritos();
    }
    this.obtenerUsuario();
    this.ComsultaComentarios();
  }
  llamar(celular){
    this.servGlobal.llamarNumero(celular);
  }  

  ComsultaComentarios() {
    this.dataApi.obtenerComentarios(this.idUsuario).subscribe(data => {
      console.log('Comentarios: ', data);
      if (data.length) {
        this.listaComentarios = data;
      } else {
        this.listaComentarios = [];
      }
    })
  }

  async obtenerUsuario() {
    await this.dataApi.obtenerUnUsuario(this.idUsuario).subscribe(async data => {
      console.log(data);
      if (data) {
        data.edad = await this.calcularEdad(data.fechaNacimiento);
        this.usuario = data;
      }
    })
  }

  calcularEdad(fecha) {
    const fechaNacimiento = new Date(fecha.seconds * 1000 + fecha.nanoseconds / 1000000);
    console.log('nacimiento: ',fechaNacimiento.getFullYear());
    // Obtener la fecha actual
    const fechaActual = new Date();
    // Obtener el año actual
    const anioActual = fechaActual.getFullYear();
    // Calcular la edad hasta el año 2023
    const edad = anioActual - fechaNacimiento.getFullYear();
    console.log('edad: ',edad);
    return edad;
  }

  aunNO() {
    this.servGlobal.presentToast('No disponible');
  }

  async startChat(item) {
    if (this.storage.datosUsuario) {
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
    } else {
      this.servGlobal.presentToast('inicie sesion para iniciar Chat');
    }
  }

  addFavoritos() {
    if (this.storage.datosUsuario && this.usuario) {
      this.dataApi.agregarFavoritos(this.storage.datosUsuario.id, this.usuario);
    } else {
      this.servGlobal.presentToast('Inicie sesion para agregar a favoritos');
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

  guardarComentario() {
    if (this.usuario.id == this.storage.datosUsuario.id) {
      this.servGlobal.presentToast('No puedes comentar en tu propio perfil');
      this.comentario = '';
      return;
    }
    this.dataApi.guardarComentarioPerfil(this.usuario.id, this.storage.datosUsuario, this.comentario).then(res => {
      this.comentario = '';
      console.log('Comentario guardado');
    });
  }

}
