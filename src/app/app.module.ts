import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import{provideAuth,getAuth} from '@angular/fire/auth';
//import { FCM } from '@awesome-cordova-plugins/fcm/ngx';

import { ComponentModule } from './components/component/component.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ModalObtenerUbicacionPage } from './modals/modal-obtener-ubicacion/modal-obtener-ubicacion.page';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CallNumber } from '@ionic-native/call-number/ngx';


@NgModule({
  declarations: [AppComponent, ModalObtenerUbicacionPage],
  entryComponents: [ModalObtenerUbicacionPage],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    ComponentModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    provideAuth(() => getAuth()),
    ComponentModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NativeStorage,
    AndroidPermissions,
    LocationAccuracy,
    CallNumber

  ], // FCM
  bootstrap: [AppComponent],
})
export class AppModule {}
