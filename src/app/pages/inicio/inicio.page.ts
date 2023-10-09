import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  irHome() {
    this.modal.dismiss(null, 'cancel');
    this.router.navigate(['/tabs/tab1']);
  }

  irLogin() {
    this.router.navigate(['/login']);
  }

}
