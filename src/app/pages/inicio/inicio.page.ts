import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  constructor(
    private router: Router,
    private storage: StorageService
  ) { }

  ngOnInit() {
  }

  irHome() {
    this.modal.dismiss(null, 'cancel');
    this.router.navigate(['/tabs/tab1']);
    this.storage.guardarInicio(true).then(() => console.log('Guardado la visita inicio'));
  }

  irLogin() {
    this.router.navigate(['/login']);
  }

}
