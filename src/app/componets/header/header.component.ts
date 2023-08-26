import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { usuarioInterface } from 'src/app/models/usuarioInterface';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  usuario: usuarioInterface;
  constructor(
    private router: Router,
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.usuario = this.storage.datosUsuario;
  }

  irPerfil(id){
    console.log(id);
    this.router.navigate(['/perfil-usuario', id]);
  }

  irLogin() {
    this.router.navigate(['/login']);
  }

}
