import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { PopoverEditarComponent } from 'src/app/components/popover-editar/popover-editar.component';
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
  datosStorage= false;
  comentario = '';
  listaComentarios = [];
  constructor(
    private router: Router,
    private chatService: ChatService,
    private dataApi: DataApiService,
    private route: ActivatedRoute,
    private servGlobal: GlobalService,
    public storage: StorageService,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.idUsuario = this.route.snapshot.params.id;
    if (this.storage.datosUsuario) {
      this.datosStorage = true;
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
    console.log(item)
    if (this.datosStorage && (this.usuario.id == this.storage.datosUsuario.id)) {
      this.servGlobal.presentToast('No puedes enviarte mensaje a tu propio perfil');
      return;
    }    
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
      this.router.navigate(['/login']);

    }
    
  }

  addFavoritos() {
    if (this.usuario.id == this.storage.datosUsuario.id) {
      this.servGlobal.presentToast('No puedes agregar a favoritos tu propio perfil');
      this.comentario = '';
      return;
    }
    if (this.storage.datosUsuario && this.usuario) {
      this.dataApi.agregarFavoritos(this.storage.datosUsuario.id, this.usuario).then(()=> {
        this.servGlobal.presentToast('Agregado a Favoritos', {position: 'top'});
      })
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
    if(this.comentario.length <=3){
      this.servGlobal.presentToast('El comentario debe ser más de 3 caracteres');

    }
    this.dataApi.guardarComentarioPerfil(this.usuario.id, this.storage.datosUsuario, this.comentario).then(res => {
      this.comentario = '';
      console.log('Comentario guardado');
    });
  }

  irPerfil(itemUsuario){
    
    if (itemUsuario.id == this.idUsuario) {
      console.log('item usuario: ', itemUsuario.id);
      console.log('idUsuario: ', this.idUsuario);
      this.servGlobal.presentToast('Estas viendo su perfil');
      return;
    }
    console.log(itemUsuario);
    this.servGlobal.goPerfil(itemUsuario);
  }
  async AccionComentario(ev: any, item: any) {
    console.log(item);
    const popover = await this.popoverCtrl.create({
      component: PopoverEditarComponent,
      event: ev,
      translucent: true,
      mode: 'ios',
      componentProps: {
        editarBorrar: true
      }
    });
    await popover.present();

    const { data } = await popover.onWillDismiss();
    console.log(data);
    if (data) {
      switch (data.action) {
        case 'editar': this.AlertaEditarComentario(item); break;
        case 'borrar': this.ConfirmarBorrarComentario( item); break;
      }
    }
  }

  async AlertaEditarComentario(item) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Comentario',
      inputs: [
        {
          name: 'inputTexto',
          type: 'textarea',
          value : item.comentario,
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Aceptar',
          handler: (data) => {
            console.log('Ingresado:', data.inputTexto);
            this.EditarComentario(this.idUsuario, this.storage.datosUsuario.id,data.inputTexto);
            // Puedes hacer algo con el valor ingresado, por ejemplo, mostrarlo en la consola
          }
        }
      ]
    });

    await alert.present();
  }
  EditarComentario(idPerfil, idUsuarioComentario,comentario){
    this.dataApi.EditarComentario(idPerfil, idUsuarioComentario, comentario).then(res => {
      this.servGlobal.presentToast('Comentario editado Correctamente', {color: 'success', icon: 'checkmark-circle-outline', position: 'top'});
    }
    ).catch(() => {
      this.servGlobal.presentToast('No se pudo editar Comentario', {color: 'danger', icon: 'alert-circle-outline', position: 'top'});
    });

  }
  async ConfirmarBorrarComentario(itemComentario){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Borrar Comentario',
      message: '¿Está seguro de borrar el comentario?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.eliminarComentario(this.idUsuario, itemComentario.id);
          }
        }
      ]
    });
    await alert.present();
  }
  eliminarComentario(idPerfil, idUsuarioComentario){
    this.dataApi.eliminarComentario(idPerfil, idUsuarioComentario).then(res => {
      this.servGlobal.presentToast('Comentario eliminado Correctamente', {color: 'success', icon: 'checkmark-circle-outline', position: 'top'});
    }
    ).catch(() => {
      this.servGlobal.presentToast('No se pudo eliminar Comentario', {color: 'danger', icon: 'alert-circle-outline', position: 'top'});
    });

  }

}
