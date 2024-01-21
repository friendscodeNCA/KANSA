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
    this.servGlobal.presentToast('Pronto estará disponible en: '+ redSocial, {position: 'top'});
  }

}
