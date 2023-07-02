import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { categoriaInterface } from '../models/categoriaInterface';

@Injectable({
  providedIn: 'root'
})
export class BuscadorService {
  LIMIT_SEARCH = 50;
  constructor(
    private afs2: AngularFirestore
  ) { }

  async Buscar(target: string){

    if (!target.length){
      return [];
    }

    let listaResultante: categoriaInterface[] = [];
    target = target.toLocaleLowerCase();

    await this.BuscarSubcategoriaNombreInicio(target).then( data => listaResultante = data);

    return listaResultante;

  }

  async BuscarSubcategoriaNombreInicio(target: string){
    // BUSCA POR NOMBRE
    return this.afs2.collection('subcategorias').ref.orderBy('nombre').startAt(target).endAt(target + '\uf8ff').limit(this.LIMIT_SEARCH)
    .get().then((querySnapshot) => {
      const resultList: categoriaInterface[] = [];
      querySnapshot.forEach( (doc: any) => {
        resultList.push({id: doc.id, ...doc.data()});
      });
      return resultList;
    });
  }
}
