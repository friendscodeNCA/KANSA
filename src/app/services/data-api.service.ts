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
  getDocs,
  setDoc
} from '@angular/fire/firestore';
import { categoriaInterface } from '../models/categoriaInterface';
import { usuarioInterface } from '../models/usuarioInterface';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { switchMap, map } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { deleteDoc } from 'firebase/firestore';

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


  // LIMITA A UN SOLO COMENTARIO POR PERFIL
  guardarComentarioPerfil(idUser: string, usuario, comentario) {
    return setDoc(doc(this.afs, 'usuarios', idUser, 'comentarios', usuario.id), 
    {id: usuario.id,
     fecha: new Date(),
     nombres: usuario.nombres,
     apellidos: usuario.apellidos,
     comentario: comentario
    }).then(() => {
      console.log('Comentario guardado correctamente');
    });
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

  agregarHistorial(idUser: string, usuario) {
    console.log('usuario: ', usuario);
    return setDoc(doc(this.afs, 'usuarios', idUser, 'historial', usuario.id),
    {id: usuario.id,
     fecha: new Date(),
     nombres: usuario.nombres,
     apellidos: usuario.apellidos,
     profesion: usuario.profesion || 'No definido',
     direccion: usuario.direccion
     }).then(() => {
      console.log('Agregado a historial correctamente');
    });
  }

  agregarFavoritos(idUser: string, usuario) {
    return setDoc(doc(this.afs, 'usuarios', idUser, 'favoritos', usuario.id), 
    {id: usuario.id,
     fecha: new Date(),
     nombres: usuario.nombres,
     apellidos: usuario.apellidos,
     profesion: usuario.profesion,
     direccion: usuario.direccion
    }).then(() => {
      console.log('Agregado a favoritos correctamente');
    });
  }

  obtenerFavorito(idUser: string, id: string) {
    return this.afs2.doc(`usuarios/${idUser}/favoritos/${id}`)
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

  //obtener COMENTARIOS
  obtenerComentarios(id) {
    return this.afs2.collection(`usuarios/${id}/comentarios`, ref => ref.orderBy('fecha', 'desc'))
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

  //obtener HISTORIAL
  obtenerListaHistorial(id) {
    return this.afs2.collection(`usuarios/${id}/historial`, ref => ref.orderBy('fecha', 'desc'))
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

  //obtener FAVORITOS
  obtenerListaFavoritos(id) {
    return this.afs2.collection(`usuarios/${id}/favoritos`, ref => ref.orderBy('fecha', 'desc'))
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

  //obtener slides Principal
  obtenerSlidesPrincipal() {
    return this.afs2.collection('slidesPrincipal', ref => ref.where('mostrar', '==' , true).orderBy('prioridad', 'desc'))
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

    eliminarFavoritosHistorial(tipo: string, id: string, idEliminar: String) {
      return this.afs2.doc<any>(`usuarios/${id}/${tipo}/${idEliminar}`).ref.delete()
      .then(() => 'exito').catch(err => {
        console.log('error', err);
        throw String('fail');
      });
    }
    eliminarComentario(idPerfil: string, idUsuarioComentario) {
      
      return this.afs2.doc(`usuarios/${idPerfil}/comentarios/${idUsuarioComentario}`).ref.delete()
      .then(() => 'exito').catch(err => {
        console.log('error', err);
        throw String('fail');
      });
    }
    EditarComentario(idPerfil: string, idUsuarioComentario, comentarioActual){
      return this.afs2.collection('usuarios').doc(idPerfil).collection('comentarios')
    .doc(idUsuarioComentario).ref.update({comentario: comentarioActual})
    .then(() => 'exito').catch(err => {
      console.log('error', err);
      throw String('fail');
    });
    }
  

}
