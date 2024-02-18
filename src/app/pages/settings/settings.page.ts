import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  id = this.storage.datosUsuario.id;
  constructor(
    private router: Router,
    private storage: StorageService,
    private authService: AuthService,
    private servGlobal: GlobalService
  ) { }

  ngOnInit() {
  }

  irPerfil(id){
    console.log(id);
    this.router.navigate(['/perfil-usuario', id]);
  }

  acercaDe() {
    this.router.navigate(['/info-app']);
  }

  cerrarSesion() {
    this.authService.logOut();
    this.storage.borrarStorage();
    this.router.navigate(['/inicio']);
  }
  redesSociales(redSocial: string){
    console.log(redSocial);
    if(redSocial == 'facebook'){
      window.open('https://www.facebook.com/profile.php?id=100095630438201 ', '_blank');
      
    }else if(redSocial == 'tiktok'){
      window.open('https://www.tiktok.com/@qansa.app?_t=8jUwLsm762f&_r=1', '_blank');

    }else {
      this.servGlobal.presentToast('Pronto estará disponible en: '+ redSocial, {position: 'top'});
    }
  }

}
