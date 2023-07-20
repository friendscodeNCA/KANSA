import { Component } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private storage: StorageService) {
    const setStatusBarStyleLight = async () => {
      await StatusBar.setStyle({ style: Style.Light });
    };
    this.initializeApp();
  }
  initializeApp() {
    this.storage.cargardatosUsuario();

  }

}
