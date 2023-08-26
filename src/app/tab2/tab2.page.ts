import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
 id = this.storage.datosUsuario?.id.toString();
  constructor(
    private router: Router, private storage: StorageService
  ) {}
  
  irPerfil(id){
    console.log(id);
    this.router.navigate(['/perfil-usuario', id]);
  }
}
