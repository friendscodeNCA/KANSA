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
import { FCM } from '@awesome-cordova-plugins/fcm/ngx';

import { ComponentModule } from './components/component/component.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    ComponentModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },FCM],
  bootstrap: [AppComponent],
})
export class AppModule {}
