import { Component, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { PasarDatosService } from '../services/pasar-datos.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  
  @ViewChild('new_chat') modal: ModalController;
  segment = 'chats';
  open_new_chat = false;
  users: Observable<any[]>;
  chatRooms: Observable<any[]>;
  model = {
    icon: 'chatbubbles-outline',
    title: 'No Chat Rooms',
    color: 'danger'
  };
  constructor(
    private router: Router,
    private chatService: ChatService,
    private pasaDatos:PasarDatosService
  ) {}

  ngOnInit() {
    this.getRooms();
  }

  getRooms() {
    // this.chatService.getId();
    this.chatService.getChatRooms();
    this.chatRooms = this.chatService.chatRooms;
    console.log('chatrooms: ', this.chatRooms);
  }
  
  onSegmentChanged(event: any) {
    console.log(event);
    this.segment = event.detail.value;
  }
  
  newChat() {
    this.open_new_chat = true;
    if(!this.users) this.getUsers();
  }

  getUsers() {
    this.chatService.getUsers();
    this.users = this.chatService.users;
  }

  cancel() {
    this.modal.dismiss();
    this.open_new_chat = false;
  }

  async startChat(item) {
    try {
      // this.global.showLoader();
      // create chatroom
      const room = await this.chatService.createChatRoom(item?.celular);
      console.log('room: ', room);
      this.cancel();
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

  getChat(item) {
    (item?.user).pipe(
      take(1)
    ).subscribe(user_data => {
      console.log('data: ', user_data);
      this.pasaDatos.setData(user_data);
      const navData: NavigationExtras = {
        queryParams: {
          name: user_data?.nombres
        }
      };
      this.router.navigate(['tabs','tab3', 'chats', item?.id], navData);
    });
  }

  getUser(user: any) {
    return user;
  }
  onWillDismiss(event){}
}
