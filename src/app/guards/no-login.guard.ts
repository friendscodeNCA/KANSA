import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NoLoginGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router, private storage: StorageService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.storage.datosUsuario) {
        console.log('Hay datos de usuario');
        this.router.navigate(['']);
        return false;
      } else {
        if(this.storage.datosUsuario == null || this.storage.datosUsuario == undefined  ){
          console.log('datos de storage son nulos o indefinidos')
          return true;
        }else {
          return this.afAuth.authState.pipe(map( auth => {
            if (auth == null || auth == undefined) {
              console.log('No Esta logeado');
              return true;
            } else if (auth) {
              console.log('Si Esta logeado');
              this.router.navigate(['']);
              return false;
            }
          }));
        }
       
      }
  }
  
  
}
