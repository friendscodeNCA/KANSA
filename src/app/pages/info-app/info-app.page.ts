import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-info-app',
  templateUrl: './info-app.page.html',
  styleUrls: ['./info-app.page.scss'],
})
export class InfoAppPage implements OnInit {

  constructor(private sanitizer: DomSanitizer,) { }

  ngOnInit() {
  }
  ContactarConAsesor(){
    console.log('enviar mensaje a asesor');
    const link = this.getWhatsAppLink();
    window.open(link.toString(), '_blank');
  }

  getWhatsAppLink(): SafeUrl {
    const message = encodeURIComponent('Hola necesito contactarme con un asesor de Qansa!');
    const url = `https://wa.me/+51910426974?text=${message}`;
    return  url;
    
  }

}
