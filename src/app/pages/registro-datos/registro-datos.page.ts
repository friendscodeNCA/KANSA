import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal, IonSearchbar, LoadingController } from '@ionic/angular';
import { categoriaInterface } from 'src/app/models/categoriaInterface';
import { BuscadorService } from 'src/app/services/buscador.service';
import { DataApiService } from 'src/app/services/data-api.service';
import { GlobalService } from 'src/app/services/global.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-registro-datos',
  templateUrl: './registro-datos.page.html',
  styleUrls: ['./registro-datos.page.scss'],
})
export class RegistroDatosPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  @ViewChild("mySearchbar", {static: false}) search: IonSearchbar;

  usuarioForm: FormGroup;
  listaBusqueda: categoriaInterface[] = [];
  listaAgregados: categoriaInterface[] = [];

  cargando =  false;
  sinDatos = false;
  celular;
  valorfcm;
  loading;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataApi: DataApiService,
    private servGlobal: GlobalService,
    private buscador: BuscadorService,
    private storage: StorageService,
    private loadingController: LoadingController
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
      listaServicios: new FormControl(''),
      descripcion: new FormControl('', [Validators.required,Validators.minLength(3), Validators.maxLength(120)]),
    });
  }

  get nombres() { return this.usuarioForm.get('nombres'); }
  get apellidos() { return this.usuarioForm.get('apellidos'); }
  get direccion() { return this.usuarioForm.get('direccion'); }
  get fechaNacimiento() { return this.usuarioForm.get('fechaNacimiento'); }
  get descripcion() { return this.usuarioForm.get('descripcion'); }

  resetForm() {
    this.usuarioForm.reset();
    this.listaAgregados = [];
    this.listaBusqueda = [];
  }

  async guardarDataUsuario() {
    console.log(this.usuarioForm.value);
    if (this.usuarioForm.valid && this.listaAgregados.length) {
      const lista = [];
      for (const servicio of this.listaAgregados) {
        lista.push(servicio.nombre)
      }
      this.usuarioForm.controls['listaServicios'].setValue(lista);
      const loading = await this.servGlobal.presentLoading('Registrando...');
      
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
      loading.dismiss();

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
      descripcion: datos.descripcion,
      celular: this.celular,
      token: this.valorfcm,
      listaServicios: datos.listaServicios
      
    };

    this.dataApi.guardarUsuario(formatoDatos).then(async res => {
      await this.storage.guardarDatosUsuario(formatoDatos).then(async () => {
        this.loading.dismiss;
        this.servGlobal.presentToast('Registrado correctamente', {color: 'success'})
      })
        await this.router.navigate(['/tabs/tab1']);
        this.resetForm();
    }).catch( (err)=> {
      this.loading.dismiss;
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
}
