import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  id;
  constructor(private afAuth: AngularFireAuth, private router: Router, private storage: StorageService) {
    if(this.storage.datosUsuario){

      this.id = this.storage.datosUsuario.id
    }
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.storage.datosUsuario) {
        console.log('Hay datos de usuario',this.storage.datosUsuario );
        return true;
      } else {
        if(this.storage.datosUsuario == null || this.storage.datosUsuario == undefined  ){
          console.log('ES UNDEFINIDO O NULLO');
          this.router.navigate(['/login']);
          return false;
        }
        return this.afAuth.authState.pipe(map( auth => {
          if (auth == null || auth == undefined) {
            console.log('No Esta logeado');
            this.router.navigate(['/login']);
            return false;
          } else if ((auth) && this.id) {
            console.log('Si Esta logeado');
            return true;
          }
        }));
      }
  }
  
}
