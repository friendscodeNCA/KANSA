import { Injectable } from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Platform } from '@ionic/angular';
import { AuthService } from './auth.service';
import { DataApiService } from './data-api.service';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  datosUsuario: any;//usuarioService

  constructor(
    private authService: AuthService,
    private dataApi: DataApiService,
    private platform: Platform,
  // private nativeStorage: NativeStorage,
  ) { }

  cargarDatosLogin() {
    const promesa = new Promise<void>( (resolve, reject) => {
      this.consultaDatos();
      resolve();
    });
    return promesa;
  }
  async guardarDatosUsuario(user) {
    console.log(user);
    const promesa = new Promise<void>( async (resolve, reject) => {
      if (this.platform.is('capacitor') ) {
        // dispositivo
        console.log('guarda:', user);
        await Preferences.set({key: 'datosUsuario', value: JSON.stringify(user)}) // { property: 'value', anotherProperty: 'anotherValue' }
        .then(
          async (data) => {
            console.log('guardado');
            // window.alert('Se guardo: ' + data);
            this.datosUsuario =JSON.parse( (await Preferences.get({ key: 'datosUsuario' })).value)
            
        }, // console.log('Stored first item!', data),
          error => console.error('Error storing item', error) , //  window.alert('Error: ' + error)
        );
      } else {
        // escritorio
        localStorage.setItem('datosUsuario', JSON.stringify(user));
        this.datosUsuario = JSON.parse(localStorage.getItem('datosUsuario'));
      }
      resolve();
    });
    return promesa;
  }

  async consultaDatos() {
    this.authService.isAuth().subscribe(user => {
      console.log('USUARIO DATOS....CELINE:')
      if (user) {
        console.log(user);
        this.dataApi.obtenerUsuarioCelular(user.email).subscribe( async data => {
          if (data) {
            if (this.platform.is('capacitor')) {
              // celular
              await Preferences.set({key: 'datosUsuario', value: JSON.stringify(user)}) // { property: 'value', anotherProperty: 'anotherValue' }
              .then(
                async (data1) => {
                  // window.alert('Se Obtuvo: ' + data1),
                  this.datosUsuario =JSON.parse( (await Preferences.get({ key: 'datosUsuario' })).value);
                }, // console.log('Stored first item!', data),
                error => alert('error' + JSON.stringify(error)) //  window.alert('Error: ' + error),
              );
            } else {
              // escritorio
              localStorage.setItem('datosUsuario', JSON.stringify(data));
              this.datosUsuario = JSON.parse(localStorage.getItem('datosUsuario'));
            }
          }
        });
      }
    });
  }

  async cargardatosUsuario() {
    console.log('Cargando datos del usuario')
    const promesa = new Promise(async  (resolve, reject) => {
      if (this.platform.is('capacitor')) {
        // celular
        this.datosUsuario =JSON.parse( (await Preferences.get({ key: 'datosUsuario' })).value)
      } else {
        console.log('Cargando datos del usuario')

        // escritorio
        if (localStorage.getItem('datosUsuario')) {
          this.datosUsuario = JSON.parse(localStorage.getItem('datosUsuario'));
        }
      }
      resolve(this.datosUsuario);
    });
    return promesa;
  }

  async borrarStorage() {
    if (this.platform.is('capacitor')) {
      // celular
     await Preferences.clear()
      .then(
        data => {
          // console.log(data);
          this.datosUsuario =  null;
        },
        error => console.error(error),
      );
    } else {
      // escritorio
      localStorage.clear();
      this.datosUsuario = null;
    }
  }
}
