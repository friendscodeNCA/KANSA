import { Component, NgZone, OnInit } from '@angular/core';
import {RecaptchaVerifier, ConfirmationResult,Auth, signInWithPhoneNumber } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
//import { FCM } from '@awesome-cordova-plugins/fcm/ngx';
import { Router } from '@angular/router';
import { DataApiService } from 'src/app/services/data-api.service';
import { StorageService } from 'src/app/services/storage.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm2: FormGroup;
  recaptchaVerifer: RecaptchaVerifier;
  confirmationResult: ConfirmationResult;
  otpSent = false;
  numCel;
  contador;
  hiddevalue = false;
  valorfcm: string = 'valor inicial de fcm';

  // eslint-disable-next-line max-len
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  loading;
  constructor(private auth: Auth,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    private zone: NgZone,
   // private fcm: FCM,
    private platform: Platform,
    private router: Router,
    private dataApi: DataApiService,
    private storage: StorageService,
    private location: Location
    ) {
      this.loginForm2 = this.createFormGroup2();
  }

  ngOnInit() {
    setTimeout(() => {
      this.recaptchaVerifer = new RecaptchaVerifier('recaptcha-container', {size: 'invisible'}, this.auth);
    }, 2000);
  }
  createFormGroup() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(this.emailPattern)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)])
    });
  }
  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  async presentLoading(mensaje) {
    this.loading = await this.loadingController.create({
      message: mensaje,
      spinner: 'crescent',
      cssClass: 'loading',
      duration: 5000,
      mode: 'ios'
    });
    await this.loading.present();
  }
  // celular
  createFormGroup2() {
    return new FormGroup({
      // tslint:disable-next-line:max-line-length
      numeroCelular: new FormControl('', [Validators.required, Validators.min(900000000), Validators.max(999999999)]),
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get numeroCelular() { return this.loginForm2.get('numeroCelular');}

  async confirmarCelular() {
    if (this.loginForm2.valid) {
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Confirmar numero',
        message: 'Enviaremos un mensaje de confirmación al <strong>' + this.loginForm2.value.numeroCelular.toString() + '</strong>.',
        mode: 'ios',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Aceptar',
            handler: () => {
              this.enviarOTP();
            }
          }
        ]
      });
      await alert.present();
     } else {
      this.presentToastError('Ingrese correctamente los campos.');
    }
  }

  async enviarOTP() {
    if (this.loginForm2.valid) {
      // console.log('datos del formulario', this.LoginForm.value.numeroCelular);
      await this.presentLoading('Enviando código');
      const celular = '+51' +  this.loginForm2.value.numeroCelular.toString();
      // console.log('numero de celular', Celular);
      console.log('captcha: ' + this.recaptchaVerifer);
      //this.crearFcm();
      signInWithPhoneNumber(this.auth,celular, this.recaptchaVerifer).then((result) => {
          this.otpSent = true;
          this.confirmationResult = result;
          this.numCel = this.loginForm2.value.numeroCelular.toString();
          // alert('otp enviado');
          this.contador = 60;
          this.startTimer();
          this.presentToastCorrecto('Codigo enviado');
          this.loginForm2.reset();
          this.loading.dismiss();
        }).catch(err => {
          console.error(err);
          this.presentToastError('No se pudo enviar el mensaje, Intentelo mas tarde.' + err);
          this.loading.dismiss();
        });
       // crear token
    } else {
      this.presentToastError('Ingrese correctamente los campos.');
    }
  }
  startTimer() {
    setTimeout(x => {
      this.zone.run(() => { this.contador -= 1; });
      if (this.contador <= 0) { }
      if (this.contador > 0) {
        this.hiddevalue = false;
        this.startTimer();
      } else {
          this.hiddevalue = true;
      }
    }, 1000);
  }
  async reenviar() {
    console.log(this.numCel);
    const celular = '+51' +  this.numCel.toString();
    console.log('cel: ', celular);
    console.log('captcha: ' + this.recaptchaVerifer);
    // console.log('numero de celular', Celular);
    await this.presentLoading('Reenviando código');
    signInWithPhoneNumber(this.auth,celular, this.recaptchaVerifer).then( (result) => {
      console.log('enviado con exito', result);
      this.otpSent = true;
      this.confirmationResult = result;
      // this.NumCel = this.LoginForm2.value.numeroCelular.toString();
      // alert('otp enviado');
      this.presentToastCorrecto('Codigo Reenviado');
      this.loginForm2.reset();
      this.loading.dismiss();
    }).catch(err => {
      console.log(err);
      this.presentToastError('No se pudo enviar el mensaje, Intentelo mas tarde.');
      this.loading.dismiss();
    });
  }
  // crearFcm() {
  //   if ( this.platform.is('cordova')) {
  //     this.fcm.getToken().then(token => {
  //       this.valorfcm = token
  //     }).catch (err => this.presentToastError('Error al obtener token' + err) );
  //   } else {this.valorfcm = 'token laptop Kansa'; console.log(this.valorfcm); }
  // }
  async presentToastCorrecto(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: 'light',
      position: 'bottom',
      buttons: [
        {
          text: 'Aceptar',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  async presentToastError(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
      buttons: [
       {
          text: 'Aceptar',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }
  async verificarOTP() {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const otp = (<HTMLInputElement> document.getElementById('otp')).value;
    console.log('otp: ', otp);
    if (otp !== '') {
      this.presentLoading('Verificando');
      this.confirmationResult.confirm(otp).then( () => {
        this.presentToastCorrecto('Codigo correcto');
        // console.log(this.NumCel);
        console.log(this.numCel);
        const userSubcribe = this.dataApi.obtenerUsuarioCelular(this.numCel).subscribe(async res => {
          userSubcribe.unsubscribe();
          console.log('res', res);
          console.log(this.numCel);


          if ((res=== null)|| (res === undefined) ){
            console.log('no hay datos y  deve dejarte ingresar tus datos');
            this.loading.dismiss();
            // this.router.navigate(['/registro-datos']);
              await this.router.navigate(['/registro-datos', this.numCel, this.valorfcm]).then(() => {
                this.loginForm2.reset();
                this.otpSent = false;
            });

          }else {
            // // alert('datos que se imgresarann' + res )
            await this.storage.guardarDatosUsuario(res).then( async () => {
              // actualizar token
              await this.dataApi.actualizarToken( this.numCel , this.valorfcm);
              // await this.menuCtrl.enable(true);
              console.log('actualiza datos por k ya hay en base de datos');
              await this.router.navigate(['/tabs/tab1']).then(() => {
                  this.loading.dismiss();
                  this.loginForm2.reset();
                  // this.IngresarDatos = false;
                  this.otpSent = false;
              });
            });

          }
        });
      }).catch(err => {
        this.presentToastError('Codigo incorrecto.');
        this.loading.dismiss();
      });
    } else {
      this.presentToastError('Complete el codigo');
    }
  }

  volver() {
    this.location.back();
  }

}
