import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataApiService } from 'src/app/services/data-api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-registro-datos',
  templateUrl: './registro-datos.page.html',
  styleUrls: ['./registro-datos.page.scss'],
})
export class RegistroDatosPage implements OnInit {
  usuarioForm: FormGroup;
  constructor(
    private router: Router,
    private dataApi: DataApiService,
    private servGlobal: GlobalService
  ) {
    this.usuarioForm = this.createFormUsuario();
   }

  ngOnInit() {
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
      const loading = await this.servGlobal.presentLoading('Registrando...');
      this.dataApi.guardarDataUsuario(this.usuarioForm.value).then(res => {
        if (res !== 'fail' && res !== 'fail') {
          this.servGlobal.presentToast('Registrado correctamente', {color: 'success'})
          this.router.navigate(['/tabs/tab1']);
          this.resetForm();
        } else {
          this.servGlobal.presentToast('No se pudo completar el registro', {color: 'danger'})
        }
        loading.dismiss();
      });
    } else {
      this.servGlobal.presentToast('Complete sus datos correctamente', {color: 'danger'})
    }
  }

  irHome() {
    this.router.navigate(['/tabs/tab1']);
  }
}
