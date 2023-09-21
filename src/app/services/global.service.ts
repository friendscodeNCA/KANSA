import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadString } from "firebase/storage";
import { Router } from '@angular/router';
import { DataApiService } from './data-api.service';
import { StorageService } from './storage.service';
import { usuarioInterface } from '../models/usuarioInterface';


@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public fotos: any[] = [];

  constructor(
    private toastCtrl: ToastController,
    private loading: LoadingController,
    private router: Router,
    private dataApi: DataApiService,
    private storage: StorageService
  ) { }

  async presentToast(
    mensaje: string,
    propiedades: {duracion?: number, position?: 'bottom'| 'top'| 'middle', color?: string, icon?: string} = {}
  ) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: propiedades.duracion || 2000,
      position: propiedades.position || 'bottom',
      color: propiedades.color || 'dark',
      buttons: [
        {
          side: 'start',
          icon: propiedades.icon || 'notifications-outline',
        }]
    });
    toast.present();
  }

  async presentLoading(mensaje: string, propiedades: {duracion?: number } = {}) {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      message: mensaje,
      duration: propiedades.duracion || 10000
    });

    await loading.present();
    return loading;
  }

  public async obtenerFotoGaleria() {
    return await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
      quality: 50,
    });
  }

  // public async obtenerFotoGaleria() {
  //   // Take a photo
  //   return await Camera.pickImages({
  //     correctOrientation: true,
  //     presentationStyle: 'fullscreen',
  //     quality: 100,
  //     limit: 1,
  //   });
  // }

  subirImagen(file: any): Promise<string> {
    console.log(file);
    /**
     * @objetivo : Subir una imagen a Firestore.
     * @return: (String): Url de la imagen.
     */
    return new Promise( resolve => {

      const storage = getStorage();
      const storageRef = ref(storage, 'categorias/' + new Date());

      console.log(storageRef);
      uploadString(storageRef, file, 'data_url').then((snapshot) => {
        console.log('Uploaded a base64url string!', snapshot);
        getDownloadURL(snapshot.ref).then(url => {
          resolve(url);
        });
      });
    });

  }

  subirImagenChat(file: any): Promise<string> {
    console.log(file);
    /**
     * @objetivo : Subir una imagen a Firestore. 
     * @return: (String): Url de la imagen.
     */
    return new Promise( resolve => {

      const storage = getStorage();
      const storageRef = ref(storage, 'chat/' + new Date());

      console.log(storageRef);
      uploadString(storageRef, file, 'data_url').then((snapshot) => {
        console.log('Uploaded a base64url string!', snapshot);
        getDownloadURL(snapshot.ref).then(url => {
          resolve(url);
        });
      });
    });
  }
  goPerfil(usuario: usuarioInterface) {
    this.router.navigate(['/perfil-usuario', usuario.id]);
    if (this.storage.datosUsuario) {
      this.dataApi.agregarHistorial(this.storage.datosUsuario.id, usuario);
    }git
  }
}
