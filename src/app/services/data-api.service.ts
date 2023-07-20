import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  docData,
  DocumentReference,
  CollectionReference,
  Firestore,
  onSnapshot,
  query,
  where,
  Unsubscribe,
  Query,
  DocumentData,
  collectionData,
  collectionChanges,
  docSnapshots,
  addDoc,
  getDocs
} from '@angular/fire/firestore';
import { categoriaInterface } from '../models/categoriaInterface';
import { usuarioInterface } from '../models/usuarioInterface';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { switchMap, map } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataApiService {
  datosUsuario: usuarioInterface;
  constructor(
    private afs: Firestore,
    private afs2: AngularFirestore,
    private platform: Platform,
    private nativeStorage: NativeStorage


  ) { }


  
  // guardarDataUsuario(newUsuarios: usuarioInterface) {
  //   return addDoc(collection(this.afs, 'usuarios'), newUsuarios).then(data => {
  //     if (data.id) {
  //       return data.id;
  //     } else {
  //       return 'fail';
  //     }
  //   })
  // }

  guardarCategoria(newCategoria: categoriaInterface) {
    newCategoria.fechaRegistro = new Date();
    return addDoc(collection(this.afs, 'categorias'), newCategoria).then(data => {
      if (data.id) {
        return data.id;
      } else {
        return 'fail';
      }
    })
  }

  guardarSubCategoria(newSubCategoria: categoriaInterface, id: string) {
    newSubCategoria.idCategoria = id;
    newSubCategoria.fechaRegistro = new Date();
    return addDoc(collection(this.afs, 'subcategorias'), newSubCategoria).then(data => {
      if (data.id) {
        return data.id;
      } else {
        return 'fail';
      }
    })
  }

  //obtener categorias
  obtenerCategorias() {
    return this.afs2.collection('categorias', ref => ref.orderBy('fechaRegistro', 'desc'))
    .snapshotChanges().pipe(map(changes => {
      const datos: categoriaInterface[] = [];

      changes.map((action: any) => {
        datos.push({
          id: action.payload.doc.id,
          ...action.payload.doc.data()
        });
      });

      return datos;
    }));
  }

  //obtener subcategorias
  obtenerSubCategorias(idCategoria: string) {
    return this.afs2.collection('subcategorias', ref => ref.where('idCategoria', '==', idCategoria).orderBy('fechaRegistro', 'desc'))
    .snapshotChanges().pipe(map(changes => {
      const datos: categoriaInterface[] = [];

      changes.map((action: any) => {
        datos.push({
          id: action.payload.doc.id,
          ...action.payload.doc.data()
        });
      });

      return datos;
    }));
  }

  // Obtener usuarios que brindan servicio

  busquedaUsuariosServicio(arrayTargets: string[]){
    return this.afs2.collection('usuarios').ref
    .where('listaServicios', 'array-contains-any', arrayTargets ).limit(50).get().then((querySnapshot) => {
      const resultList: any[] = [];
      querySnapshot.forEach( (doc: any) => {
        resultList.push({id: doc.id, ...doc.data()});
      });
      return resultList;
    });
  }

  // Obtener un Usuario
  obtenerUnUsuario(id: string) {
    return this.afs2.doc(`usuarios/${id}`)
    .snapshotChanges().pipe(map(action => {
      let datos: any = {};
      if (action.payload.exists === false) {
        return null;
      } else {
        datos = {
          ...action.payload.data() as usuarioInterface,
          id: action.payload.id
        };
        return datos;
      }
    }));
  }
  //...........LOGIN............
  // ACTUALIZA TOKEN
  actualizarToken(celular: string, token1: string){
    return this.afs2.collection('usuarios').doc(celular).update({token: token1}).then(() => 'exito')
    .catch(err => {
      throw String('fail');
    });
  }
   // obtener usuariocon celular
  obtenerUsuarioCelular(celular: string) {
    return this.afs2.doc(`usuarios/${celular}`).snapshotChanges().pipe(map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as any; // UsuarioInterface
        data.id = action.payload.id;
        return data;
      }
    }));
  }
    // guardar usuario
    guardarUsuario(usuario: any) {
      usuario.nombres = usuario.nombres.toLocaleLowerCase();
      usuario.apellidos = usuario.apellidos.toLocaleLowerCase();
      const cel = usuario.celular;
      return this.afs2.collection('usuarios').doc(cel).set(usuario).then(() => 'exito').catch(err => err);
    }
  

}
