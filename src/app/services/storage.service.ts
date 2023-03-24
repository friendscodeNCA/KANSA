import { Injectable } from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Platform } from '@ionic/angular';
import { AuthService } from './auth.service';
import { DataApiService } from './data-api.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  datosUsuario: any;//usuarioService

  constructor(
    private authService: AuthService,
    private dataApi: DataApiService,
    private platform: Platform,
    private nativeStorage: NativeStorage
  ) { }

  cargarDatosLogin() {
    const promesa = new Promise<void>( (resolve, reject) => {
      this.consultaDatos();
      resolve();
    });
    return promesa;
  }
  guardarDatosUsuario(user) {
    console.log(user);
    const promesa = new Promise<void>( (resolve, reject) => {
      if (this.platform.is('cordova')) {
        // dispositivo
        console.log('guarda:', user);
        this.nativeStorage.setItem('datosUsuario', user) // { property: 'value', anotherProperty: 'anotherValue' }
        .then(
          (data) => {
            console.log('guardado');
            // window.alert('Se guardo: ' + data);
            this.nativeStorage.getItem('datosUsuario')
            .then(
              data1 => this.datosUsuario = data1, // console.log(data),
              error => console.error(error), // window.alert('Error: ' + error)
            );
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

  consultaDatos() {
    this.authService.isAuth().subscribe(user => {
      if (user) {
        console.log(user);
        this.dataApi.obtenerUnAdministrador(user.email).subscribe( data => {
          if (data) {
            if (this.platform.is('cordova')) {
              // celular
              this.nativeStorage.setItem('datosUsuario', data) // { property: 'value', anotherProperty: 'anotherValue' }
              .then(
                (data1) => {
                  // window.alert('Se Obtuvo: ' + data1),
                  this.nativeStorage.getItem('datosUsuario')
                  .then(
                    data2 => {
                      // window.alert('cargado: ' + data1),
                      this.datosUsuario = data2;
                    }, // console.log(data),
                    error => console.error(error)  // window.alert('Error: ' + error),
                  );
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

  cargardatosUsuario() {
    const promesa = new Promise( (resolve, reject) => {
      if (this.platform.is('cordova')) {
        // celular
        this.nativeStorage.getItem('datosUsuario')
          .then(
            data => {
              if (data) {
                this.datosUsuario = data;
              }
            }, // console.log(data),
            error => console.error(error),
          );
      } else {
        // escritorio
        if (localStorage.getItem('datosUsuario')) {
          this.datosUsuario = JSON.parse(localStorage.getItem('datosUsuario'));
        }
      }
      resolve(this.datosUsuario);
    });
    return promesa;
  }

  borrarStorage() {
    if (this.platform.is('cordova')) {
      // celular
      this.nativeStorage.clear()
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
