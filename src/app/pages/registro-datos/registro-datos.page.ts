import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal, LoadingController } from '@ionic/angular';
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
  celular;
  valorfcm;
  loading;
  usuarioForm: FormGroup;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataApi: DataApiService,
    private servGlobal: GlobalService,
    private loadingController: LoadingController,
    private storage: StorageService,
  ) {
    this.usuarioForm = this.createFormUsuario();
   }

  ngOnInit() {
    this.celular = this.route.snapshot.params.celular;
    this.valorfcm  = this.route.snapshot.params.token;
    console.log(this.celular, this.valorfcm)
  }

  createFormUsuario() {
    return new FormGroup({
      nombres: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]),
      apellidos: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]),
      direccion: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]),
      fechaNacimiento: new FormControl('', [Validators.required]),
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
  }

  async guardarDataUsuario() {
    console.log(this.usuarioForm.value);
    if (this.usuarioForm.valid) {
      await this.presentLoading('Creando nuevo usuario...');
      this.guardarDatos(this.usuarioForm.value)
      
    } else {
      this.servGlobal.presentToast('Complete sus datos correctamente', {color: 'danger'})
    }
  }
  async guardarDatos(datos: any){
    const formatoDatos: any = {
      nombres: datos.nombres ,
      apellidos: datos.apellidos,
      direccion: datos.direccion,
      fechaNacimiento: datos.fechaNacimiento,
      descripcion: datos.descripcion,
      celular: this.celular,
      token: this.valorfcm,
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
  }
  async presentLoading(mensaje: string) {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: mensaje,
    });
    await this.loading.present();
  }
}
