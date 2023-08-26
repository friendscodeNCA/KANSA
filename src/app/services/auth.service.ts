import { Injectable } from '@angular/core';
import { Auth, getAuth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public _uid = new BehaviorSubject<any>(null);

  currentUser: any;
  
  constructor(private auth: AngularFireAuth,
    private fireAuth: Auth,

    private apiService: ApiService) { }
  isAuth() {
    return this.auth.authState.pipe(map(auth => auth));
  }

  getId() {
    const auth = getAuth();
    console.log('current user auth: ', auth.currentUser);
    this.currentUser = auth.currentUser;
    console.log(this.currentUser);
    return this.currentUser?.uid;
  }

  logOut() {
    this.auth.signOut().then(res => {
      console.log('sesion cerrada');
    });
  }
}
