import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.page.html',
  styleUrls: ['./presentacion.page.scss'],
})
export class PresentacionPage implements OnInit {
  @ViewChild('slider', { static: false })slider: IonSlides;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  siguiente() {
    this.slider.slideTo(2);
  }

  irInicio() {
    this.router.navigate(['/inicio']);
  }

}
