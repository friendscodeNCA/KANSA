import { ChatService } from 'src/app/services/chat.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, NavController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/services/global.service';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  public ocultar1: boolean = false;
  foto: any;
  image: any;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  id: string;
  nombres: string;
  chats: Observable<any[]>;
  message: string;
  isLoading: boolean;
  model = {
    icon: 'chatbubbles-outline',
    title: 'Chat vacío',
    color: 'primary'
  };

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    public chatService: ChatService,
    private servGlobal: GlobalService,
    private platform: Platform,
  ) { }

  ngOnInit() {
    const data: any = this.route.snapshot.queryParams;
    console.log('data: ', data);
    if(data?.name) {
      this.nombres = data.name;//enviar nombre de usuario
    }
    const id = this.route.snapshot.paramMap.get('id');
    console.log('check id: ', id);
    if(!id) {
      this.navCtrl.back();
      return;
    } 
    this.id = id;
    this.chatService.getChatRoomMessages(this.id);
    this.chats = this.chatService.selectedChatRoomMessages;
    console.log(this.chats);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    console.log('scroll bottom');
    if(this.chats) this.content.scrollToBottom(500);
  }

  async sendMessage() {
    if(!this.message || this.message?.trim() == '') {
      if (!this.foto) {
        this.servGlobal.presentToast('Escribe un mensaje...');
        console.log('ingrese palabra');
        return;
      }else{
        await this.servGlobal.subirImagenChat(this.foto).then(url => {
      
          this.isLoading = true;
          this.chatService.sendMessage(this.id, this.message, url);
          this.ocultar1 = !this.ocultar1;
          this.message = '';
          this.foto = false;
          this.isLoading = false;
          this.scrollToBottom();
          })
      }
      // this.global.errorToast('Please enter a proper message', 2000);
      return;
    }
    try {
      if (!this.foto) {
        this.isLoading = true;
      this.chatService.sendMessage(this.id, this.message, null);
      this.message = '';
      this.isLoading = false;
      this.scrollToBottom();
      }else{
        await this.servGlobal.subirImagenChat(this.foto).then(url => {
      
          this.isLoading = true;
          this.chatService.sendMessage(this.id, this.message, url);
          this.ocultar1 = !this.ocultar1;
          this.message = '';
          this.foto = false;
          this.isLoading = false;
          this.scrollToBottom();
          })
      }
      //---
      
      //--
      
    } catch(e) {
      this.isLoading = false;
      console.log(e);
      // this.global.errorToast();
    }
  }

  obtenerFotoChat() {
    this.servGlobal.obtenerFotoGaleria().then(res => {
      if (res) {
        this.foto =  'data:image/png;base64,' + res.base64String;
        console.log('fotosss', this.foto);
        this.ocultar1 = !this.ocultar1;
      }
    })
  }

  cerrarFoto(){
    this.foto = '';
    this.ocultar1 = !this.ocultar1;
  } 
  
  async SubirFotoCG() {
    if(this.platform.is('capacitor')){
      const dataImage = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        height: 720,
        width:720,
        correctOrientation: true,
        quality: 0.6,
        promptLabelPhoto: 'Galeria',
        promptLabelHeader: 'Subir imagen',
        promptLabelCancel: 'Cancelar',
        promptLabelPicture: 'Camara',
  
      });
      var myImg = document.getElementById('fotoPerfil') as HTMLImageElement;
      myImg.src = dataImage.webPath;
      this.image = 'data:image/jpeg;base64,'+  dataImage.base64String;
    }else {
      console.log('solo se abre en android');
    }
    
  }

}
