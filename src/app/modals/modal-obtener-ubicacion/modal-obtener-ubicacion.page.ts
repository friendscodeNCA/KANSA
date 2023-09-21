import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
declare var google; 

@Component({
  selector: 'app-modal-obtener-ubicacion',
  templateUrl: './modal-obtener-ubicacion.page.html',
  styleUrls: ['./modal-obtener-ubicacion.page.scss'],
})

export class ModalObtenerUbicacionPage implements OnInit {
  @ViewChild('map1', { static: true}) mapElement;
  MapaForm: FormGroup;
  map: any;
  centro;
  // direccion;
  address;
  completar = false;
  geocoderr;
  provincia;
  loading;
  constructor(private modalCrtl: ModalController,
              private zone: NgZone,
              private toastController: ToastController,
              private androidPermissions: AndroidPermissions,
              private locationAccuracy: LocationAccuracy,
              private platform: Platform,
              private loadingController: LoadingController) {
    this.MapaForm = this.createFormGroup();
  }
  ngOnInit() {
    if (this.platform.is('cordova')|| this.platform.is('capacitor')) {
      this.checkGPSPermission();
    } else {
      console.log('WEB');
      this.obtenerCoords();
    }
  }
  createFormGroup() {
    return new FormGroup({
      referencia: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }
  get referencia() { return this.MapaForm.get('referencia'); }


  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {this.askToTurnOnGPS(); } else {
          this.requestGPSPermission(); }
      }, err => { this.presentToast('Active su GPS'); }
    ); }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {} else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(() => {
              this.askToTurnOnGPS();
            }, error => { this.presentToast('Error al obtener permiso de ubicación'); }
          );
      } });
  }

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        this.obtenerCoords();
      },
      error => {this.askToTurnOnGPS(); }
    );
  }

  initMap(lati, lngi) {
    console.log('mapa');
    const mapOptions = {
        zoomControl: false,
        scaleControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: false,
        zoom: 17,
        minZoom: 14,
        maxZoom: 20,
        center: {lat: lati, lng: lngi},
      };
    this.map = new google.maps.Map(document.getElementById('map1'), mapOptions);
    this.geocoderr = new google.maps.Geocoder(); // solo agregas esto Y DECLARAR  VARIABLE GEOCODERR
    this.centro = this.map.getCenter();
    this.obtenerDireccionApiGoogle(this.centro ); // llamas la funcion para k te devuelva la direccion una ves k hay una coordenada y mapa
    google.maps.event.addListener(this.map, 'dragend', (res) => {
      const center = this.map.getCenter();
      this.obtenerDireccionApiGoogle(center ); // llamas la funcion para k te devuelva la direccion  cada ves k  cambia el centro del mapa
      this.centro = this.map.getCenter();
      // this.ObtenerAddres( center.lat(), center.lng());
      console.log('latitude', this.centro.lat(), 'longitude', this.centro.lng());
    });
  }
    obtenerDireccionApiGoogle(LatLng) {
      // tslint:disable-next-line:object-literal-key-quotes
      this.geocoderr.geocode({ 'location': LatLng}, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
          //  alert(results[0].formatted_address);
          // console.log(results[0].formatted_address);
          const prueba = results[0].address_components;
          console.log(prueba);
          prueba.forEach(element => {
            // if ( element.types[0] === 'country') {
            //   console.log('Pais', element.long_name);
            // }
            // if ( element.types[0] === 'administrative_area_level_1') {
            //   console.log('Departamento', element.long_name);
            // }
            if ( element.types[0] === 'administrative_area_level_2') {
              console.log('Provincia', element.long_name);
              this.provincia = element.long_name;
            }
            // if ( element.types[0] === 'locality' && element.types[1] === 'political') {
            //   console.log('distrito', element.long_name);
            // }
            // console.log('prueba');
            // console.log(element);
          });
          // this.address = results[0].formatted_address; // TIENES  K DECLARAR   LA VARIABLE ADDRES
          this.zone.run(() => {this.address = results[0].formatted_address; });
          } else {
            // window.alert('No results found');
            this.presentToast('No se encontró la ubicación');
          }
        } else {
          // window.alert('Geocoder failed due to: ' + status);
          this.presentToast('Error: No se pudo obtener su direccion, intentelo nuevamente');
        }
    });

    }

  async obtenerCoords() {
    await this.presentLoading('Obteniendo ubicación...');
    const options = {
      timeout: 5000
    };
    // this.geolocation.getCurrentPosition(options).then(res => {
    //   // this.centro = { res.coords.latitude, res.coords.longitude};
    //   console.log('Se pudo', res);
    //   this.initMap(res.coords.latitude, res.coords.longitude);
    //   this.loading.dismiss();
    // }).catch(err => {
    //   console.log('no se pudo obtener corrdenadas');
    //   // this.cerrarModal();
    //   this.initMap(-13.656507777294813, -73.38996886749342);
    //   this.presentToast('No se pudo obtener su ubicación');
    //   this.loading.dismiss();
    // });

   const   cordenadas = await Geolocation.getCurrentPosition(options);
   console.log('COORDENADAS', cordenadas.coords.latitude);
   if(cordenadas && cordenadas.coords){
      this.initMap(cordenadas.coords.latitude, cordenadas.coords.longitude);
       this.loading.dismiss();
   }else{

     this.presentToast('No se pudo obtener su ubicación');
     this.initMap(-13.656507777294813, -73.38996886749342);
     this.loading.dismiss();
   }
  }
  

  GuardarUbicacion() {
    console.log('provincia a evaluar', this.provincia.length);
    // && this.provincia !== 'Abancay'
    if ( this.provincia !== 'Andahuaylas'){
      const mensaje = 'Aún no estamos disponibles en tu ubicación';
      this.presentToastError(mensaje);
    }
    if (this.MapaForm.valid) {
      // tslint:disable-next-line:max-line-length
      this.modalCrtl.dismiss({
        latitude: this.centro.lat(),
        longitude: this.centro.lng(),
        direccion: this.address,
        // tienda: 'adonay',
        provincia: this.provincia,
        referencia: this.MapaForm.value.referencia
      });
    } else {
      this.completar = true;
      console.log('falta', this.address)
    }
  }async presentToastError(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: 'danger',
      position: 'bottom',
      buttons: [
       {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  async presentLoading(mensaje: string) {
    this.loading = await this.loadingController.create({
      message: mensaje,
      duration: 3000
    });
    await this.loading.present();
  }
  cerrarModal() {

    this.modalCrtl.dismiss();
  }

}
