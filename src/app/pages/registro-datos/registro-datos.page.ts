import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal, IonSearchbar, LoadingController, ModalController, Platform } from '@ionic/angular';
import { categoriaInterface } from 'src/app/models/categoriaInterface';
import { BuscadorService } from 'src/app/services/buscador.service';
import { DataApiService } from 'src/app/services/data-api.service';
import { GlobalService } from 'src/app/services/global.service';
import { StorageService } from 'src/app/services/storage.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { DatePipe } from '@angular/common';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ModalObtenerUbicacionPage } from 'src/app/modals/modal-obtener-ubicacion/modal-obtener-ubicacion.page';

@Component({
  selector: 'app-registro-datos',
  templateUrl: './registro-datos.page.html',
  styleUrls: ['./registro-datos.page.scss'],
  providers: [DatePipe]
})
export class RegistroDatosPage implements OnInit {
  @ViewChild("modalServicios") modal: IonModal;
  @ViewChild("mySearchbar", {static: false}) search: IonSearchbar;

  usuarioForm: FormGroup;
  listaBusqueda: categoriaInterface[] = [];
  listaAgregados: categoriaInterface[] = [];

  cargando =  false;
  sinDatos = false;
  celular;
  valorfcm;
  loading;
  image: any;
  imagePortada: any;
  urlPortada: any;
  urlPerfil: any;
  progress;


  userUbicacion: {
    direccion: string,
    lat: any,
    long: any,
    referencia: string,
    provincia: string
  };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataApi: DataApiService,
    private servGlobal: GlobalService,
    private buscador: BuscadorService,
    private storage: StorageService,
    private loadingController: LoadingController,
    private platform: Platform,
    private datePipe: DatePipe,
    private firebaseStorage: AngularFireStorage,
    private modalController: ModalController,
    
    
  ) {
    this.usuarioForm = this.createFormUsuario();
   }

  ngOnInit() {
    this.celular = this.route.snapshot.params.celular;
    this.valorfcm  = this.route.snapshot.params.token;

    console.log(this.celular, this.valorfcm)  
  }

  eliminarDataBusqueda(ev) {
    this.search.value = null;
    this.sinDatos = false;
  }

  buscarSubcategoria(ev) {
    console.log(ev.detail.value);
    const target = ev.detail.value;
    if (target.length) {
      this.cargando = true;
      this.buscador.Buscar(target).then(res => {
        if (res.length) {
          this.listaBusqueda = res;
        } else {
          this.listaBusqueda = [];
          this.sinDatos = true
        }
        this.cargando = false;        
      }).catch(err => {
        this.cargando = false;
        this.sinDatos = true;
      });
    } else {
      this.listaBusqueda = [];
    }
  }

  addArrayServicios(subcategoria) {
    subcategoria.agregado = true;
    console.log('Tenemos: ', this.listaAgregados, this.comprobarSiYaExiste(subcategoria))
    if (this.comprobarSiYaExiste(subcategoria)) {
      this.servGlobal.presentToast('Ya agregaste este servicio', {color: 'danger', position: 'top'});
    } else {
      this.listaAgregados.push(subcategoria);
      this.servGlobal.presentToast('Agregado correctamente', {color: 'success', position: 'top'});
    }
  }

  comprobarSiYaExiste(dato) {
    if (this.listaAgregados.length) {
      let agregado = false;
      for (const iterator of this.listaAgregados) {
        if (iterator.id === dato.id) agregado = true;
      }
      return agregado;
    } else {
      return false;
    }
  }

  eliminarDeListaAgregados(data) {
    let indice = this.listaAgregados.indexOf(data);
    console.log(indice);
    if (indice > -1) {
      this.listaAgregados.splice(indice, 1);
      data.agregado = false;
    } else console.log('NO EXISTE');
  }

  createFormUsuario() {
    return new FormGroup({
      nombres: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]),
      apellidos: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]),
      direccion: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]),
      fechaNacimiento: new FormControl('', [Validators.required]),
      disponibilidad: new FormControl('', [Validators.required]),
      listaServicios: new FormControl(''),
      descripcion: new FormControl('', [Validators.required,Validators.minLength(3), Validators.maxLength(120)]),
    });
  }

  get nombres() { return this.usuarioForm.get('nombres'); }
  get apellidos() { return this.usuarioForm.get('apellidos'); }
  //get direccion() { return this.usuarioForm.get('direccion'); }
  get fechaNacimiento() { return this.usuarioForm.get('fechaNacimiento'); }
  get disponibilidad() { return this.usuarioForm.get('disponibilidad'); }
  get descripcion() { return this.usuarioForm.get('descripcion'); }

  resetForm() {
    this.usuarioForm.reset();
    this.listaAgregados = [];
    this.listaBusqueda = [];
  }

  async guardarDataUsuario() {
    console.log(this.usuarioForm.value);
    this.usuarioForm.controls['direccion'].setValue(this.userUbicacion);
    this.usuarioForm.controls['fechaNacimiento'].setValue(new Date());
    
    if (this.usuarioForm.valid && this.listaAgregados.length) {
      this.loading = await this.servGlobal.presentLoading('Registrando...');
      if(this.image){
        await this.uploadImagePerfil(this.image).then(url => {
          this.urlPerfil = url;
        })
      }
      if(this.imagePortada){
        await this.uploadImagePortada(this.imagePortada).then(urlPort => {
          this.urlPortada = urlPort;

        })
      }

      const lista = [];
      for (const servicio of this.listaAgregados) {
        lista.push(servicio.nombre)
      }
      this.usuarioForm.controls['listaServicios'].setValue(lista);
      
      // this.dataApi.guardarDataUsuario(this.usuarioForm.value).then(res => {
      //   if (res !== 'fail' && res !== 'fail') {
      //     this.servGlobal.presentToast('Registrado correctamente', {color: 'success'})
      //     this.router.navigate(['/tabs/tab1']);
      //     this.resetForm();
      //   } else {
      //     this.servGlobal.presentToast('No se pudo completar el registro', {color: 'danger'})
      //   }
      //   loading.dismiss();
      // });
       // this.dataApi.guardarDataUsuario(this.usuarioForm.value).then(res => {
      //   if (res !== 'fail' && res !== 'fail') {
      //     this.servGlobal.presentToast('Registrado correctamente', {color: 'success'})
      //     this.router.navigate(['/tabs/tab1']);
      //     this.resetForm();
      //   } else {
      //     this.servGlobal.presentToast('No se pudo completar el registro', {color: 'danger'})
      //   }
      //   loading.dismiss();
      // });
      this.guardarDatos(this.usuarioForm.value);
    } else {
      this.servGlobal.presentToast('Complete sus datos correctamente', {color: 'danger'})
    }
  }
  // async guardarDataUsuario() {
  //   console.log(this.usuarioForm.value);
  //   if (this.usuarioForm.valid) {
  //     await this.presentLoading('Creando nuevo usuario...');
  //     this.guardarDatos(this.usuarioForm.value)
      
  //   } else {
  //     this.servGlobal.presentToast('Complete sus datos correctamente', {color: 'danger'})
  //   }
  // }
  async guardarDatos(datos: any){
    const formatoDatos: any = {
      nombres: datos.nombres ,
      apellidos: datos.apellidos,
      direccion: datos.direccion,
      fechaNacimiento: datos.fechaNacimiento,
      disponibilidad: datos.disponibilidad,
      descripcion: datos.descripcion,
      celular: this.celular,
      token: this.valorfcm,
      listaServicios: datos.listaServicios,
      urlPortada: this.urlPortada ?this.urlPortada: null,
      urlPerfil: this.urlPerfil ?this.urlPerfil: null
      
    };

    this.dataApi.guardarUsuario(formatoDatos).then(res => {
      this.storage.guardarDatosUsuario(formatoDatos).then(() => {
        this.servGlobal.presentToast('Registrado correctamente', {color: 'success'});
        this.loading.dismiss();
        this.router.navigate(['/tabs/tab1']);
        this.resetForm();
      })
    }).catch( (err)=> {
      this.loading.dismiss();
      this.servGlobal.presentToast('No se pudo completar el registro', {color: 'danger'})
    });
  }

  irHome() {
    this.router.navigate(['/tabs/tab1']);
  }

  cerrarModal() {
    this.modal.dismiss();
    this.listaBusqueda = [];
  }
  async presentLoading(mensaje: string) {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: mensaje,
    });
    await this.loading.present();
  }
  async SubirFotoPerfil() {
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
  async SubirFotoPortada() {
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
      var myImg = document.getElementById('fotoPortada') as HTMLImageElement;
      myImg.src = dataImage.webPath;
      this.imagePortada = 'data:image/jpeg;base64,' + dataImage.base64String;
    }else {
      console.log('solo se abre en android');
    }
    
  }
  // subirFotoStorage(tipo: string){
  //   if(tipo=== 'perfil'){
  //     this.uploadImagePerfil(this.image).then(res=> {
  //       console.log('se pudo subir foto PERFIL');
  //     })

  //   }else if(tipo === 'portada')
  //   this.uploadImagePortada(this.imagePortada).then(res=> {
  //     console.log('se pudo subir foto PORTADA');
  //   })
  
  // }


  uploadImagePerfil(image) {
    // window.alert(image);
    return new Promise<any>((resolve, reject) => {
      // tslint:disable-next-line:prefer-const
      let storageRef = this.firebaseStorage.storage.ref();
      const id = this.celular + this.datePipe.transform(new Date(), 'medium');
      // tslint:disable-next-line:prefer-const
      let imageRef = storageRef.child('fotoPerfil/' + id);
      // tslint:disable-next-line:only-arrow-functions
      imageRef.putString(image, 'data_url')
      .then(snapshot => {
        this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(this.progress);
        console.log('Upload is ' + this.progress + '% done');
        console.log(snapshot);
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);
          resolve(downloadURL);
        });
      }, err => {
        reject(err);
      });
    });
  }
  uploadImagePortada(image) {
    // window.alert(image);
    return new Promise<any>((resolve, reject) => {
      // tslint:disable-next-line:prefer-const
      let storageRef = this.firebaseStorage.storage.ref();
      const id = this.celular + this.datePipe.transform(new Date(), 'medium');
      // tslint:disable-next-line:prefer-const
      let imageRef = storageRef.child('fotoPORTADA/' + id);
      // tslint:disable-next-line:only-arrow-functions
      imageRef.putString(image, 'data_url')
      .then(snapshot => {
        this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(this.progress);
        console.log('Upload is ' + this.progress + '% done');
        console.log(snapshot);
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);
          resolve(downloadURL);
        });
      }, err => {
        reject(err);
      });
    });
  }

  async modalUbicacion() {
    const modal = await this.modalController.create({
      component: ModalObtenerUbicacionPage,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
    const data= await modal.onWillDismiss();
    console.log(data.data)
    if ((data.data!== null) || (data.data!== undefined)) {
      this.userUbicacion = {
        direccion: data.data.direccion,
        lat: data.data.latitude,
        long: data.data.longitude,
        referencia: data.data.referencia,
        provincia: data.data.provincia
      }
      console.log(this.userUbicacion)
    }
  }
}
