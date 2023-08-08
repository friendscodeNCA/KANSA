import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, docData, Firestore, getDocs, orderBy, OrderByDirection, query, where } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private firestore: Firestore) { }

  docRef(path) {
    return doc(this.firestore, path);
  }

  collectionRef(path): import("@angular/fire/firestore").CollectionReference<import("@angular/fire/firestore").DocumentData> {
    return collection(this.firestore, path);
  }

  addDocument(path, data) {
    const dataRef = this.collectionRef(path);
    return addDoc<any>(dataRef, data); //add()
  }

  getDocs(path, queryFn?) {
    let dataRef: any = this.collectionRef(path);
    if(queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q;
    }
    return getDocs<any>(dataRef); //get()
  }

  collectionDataQuery(path, queryFn?) {
    let dataRef: any = this.collectionRef(path);
    if(queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q;
    }
    const collection_data = collectionData<any>(dataRef, {idField: 'id'}); // valuechanges, for doc use docData
    return collection_data;
  }

  docDataQuery(path, id?, queryFn?) {
    let dataRef: any = this.docRef(path);
    if(queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q;
    }
    let doc_data;
    if(id) doc_data = docData<any>(dataRef, {idField: 'id'});
    else doc_data = docData<any>(dataRef); // valuechanges, for doc use docData
    return doc_data;
  }

  whereQuery(fieldPath, condition, value) {
    return where(fieldPath, condition, value);
  }

  orderByQuery(fieldPath, directionStr: OrderByDirection = 'asc') {
    return orderBy(fieldPath, directionStr);
  }
}