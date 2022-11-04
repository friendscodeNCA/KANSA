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

  guardarSubCategoria(newSubCategoria: categoriaInterface, id: string) {
    return addDoc(collection(this.afs, 'categorias/' + id + '/subcategorias'), newSubCategoria).then(data => {
      if (data.id) {
        return data.id;
      } else {
        return 'fail';
      }
    })
  }

  async obtenerCategorias() {
    const userRef = query<categoriaInterface>(collection(this.afs, 'categorias') as CollectionReference<categoriaInterface>);
    // METODO GET - SI FUNCIONA
    // return getDocs(userRef).then( (querySnapshot) => { // FUNCIONA COMO GET
    //   const datos: any[] = [];
    //   querySnapshot.forEach((doc) => {
    //     datos.push( {...doc.data(), id: doc.id});
    //   });
    //   return datos;
    // });

    // NO SE PUDO CON SUBSCRIBE -- YA SE PUDO
    const datos: any[] = [];
    await onSnapshot(userRef, (snapshot) => {
      snapshot.forEach((doc) => {
        datos.push( {...doc.data(), id: doc.id});
      })
    });
    return datos;

    // VERSION 1
    // return collectionData<categoriaInterface>(
    //   query<categoriaInterface>(
    //     collection(this.afs, 'categorias') as CollectionReference<categoriaInterface>,
    //     // where('published', '==', true)
    //   )
    // );
  }

  async obtenerSubCategorias(id: string) {
    const userRef = query<categoriaInterface>(collection(this.afs, 'categorias/' + id + '/subcategorias') as CollectionReference<categoriaInterface>);
    // return getDocs(userRef).then( (querySnapshot) => { // FUNCIONA COMO GET
    //   const datos: any[] = [];
    //   querySnapshot.forEach((doc) => {
    //     datos.push( {...doc.data(), id: doc.id});
    //   });
    //   return datos;
    // });
    

    const querySnapshot = await getDocs(userRef);
    return querySnapshot;
  }
}
