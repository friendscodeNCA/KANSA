import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { createConnection } from 'net';
import { BuscadorService } from 'src/app/services/buscador.service';
import { ChatService } from 'src/app/services/chat.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-resultados-busqueda',
  templateUrl: './resultados-busqueda.page.html',
  styleUrls: ['./resultados-busqueda.page.scss'],
})
export class ResultadosBusquedaPage implements OnInit {

  @Input() item: any;
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  @ViewChild('new_chat') modal: ModalController;
  open_new_chat = false;

  target: string;
  listaUsuarios = [];
  sinDatos = false;
  constructor(
    private buscador: BuscadorService,
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private globalService: GlobalService
  
  ) { }

  ngOnInit() {
    this.target = this.route.snapshot.params.target;
    console.log(this.target);
    this.buscar();
  }
  llamar(celular){
    this.globalService.llamarNumero(celular);
  }

  buscar() {
    this.buscador.buscarServicioGeneral(this.target).then(res => {
      console.log('BUSCADOR: ', res);
      if (res.length) {
        this.listaUsuarios = res;
        this.sinDatos= false;
      } else {
        this.listaUsuarios = [];
        this.sinDatos= true;
      }
    })
  }

  buscarGeneral(event) {
    this.buscador.buscarServicioGeneral(event.target.value).then(res => {
      console.log('BUSCADOR DENTRO: ', res);
      if (res.length) {
        this.listaUsuarios = res;
        this.sinDatos = false;
      } else {
        this.listaUsuarios = [];
        this.sinDatos = true;
      }
    })
  }

  // redirect() {
  //   this.onClick.emit(this.listaUsuarios);
  //   console.log('datos===', this.listaUsuarios);
  // }

  cancel() {
    this.modal.dismiss();
    this.open_new_chat = false;
  }

  // async startChat(item) {
  //   console.log('lsdfhasjhdfashfsjkhfklda')
  //   try {
  //     // this.global.showLoader();
  //     // create chatroom
  //     const room = await this.chatService.createChatRoom(item?.uid);
  //     console.log('room: ', room);
  //     this.cancel();
  //     const navData: NavigationExtras = {
  //       queryParams: {
  //         name: item?.name
  //       }
  //     };
  //     this.router.navigate(['/', 'tab3', 'chats', room?.id], navData);
  //     // this.global.hideLoader();
  //   } catch(e) {
  //     console.log(e);
  //     // this.global.hideLoader();
  //   }
  // }
  irPerfil(usuario){
    this.globalService.goPerfil(usuario);
  }
}
