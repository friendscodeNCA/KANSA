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

@Injectable({
  providedIn: 'root'
})
export class DataApiService {

  constructor(
    private afs: Firestore,
    private afs2: AngularFirestore

  ) { }


  
  guardarDataUsuario(newUsuarios: usuarioInterface) {
    return addDoc(collection(this.afs, 'usuarios'), newUsuarios).then(data => {
      if (data.id) {
        return data.id;
      } else {
        return 'fail';
      }
    })
  }

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
}
