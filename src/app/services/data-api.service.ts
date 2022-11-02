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
  addDoc
} from '@angular/fire/firestore';
import { categoriaInterface } from '../models/categoriaInterface';
import { usuarioInterface } from '../models/usuarioInterface';

@Injectable({
  providedIn: 'root'
})
export class DataApiService {

  constructor(
    private afs: Firestore
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
    return addDoc(collection(this.afs, 'categorias'), newCategoria).then(data => {
      if (data.id) {
        return data.id;
      } else {
        return 'fail';
      }
    })
  }

  obtenerCategorias() {
    return collectionData<categoriaInterface>(
      query<categoriaInterface>(
        collection(this.afs, 'categorias') as CollectionReference<categoriaInterface>,
        // where('published', '==', true)
      )
    );
  }
}
