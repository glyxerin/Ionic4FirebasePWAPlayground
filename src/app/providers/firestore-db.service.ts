import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FirestoreDbService {

  constructor(private db: AngularFirestore) { }

  getAllData(collectionId) {
    // return this.db.collection('product').valueChanges();
    return this.db.collection(collectionId).snapshotChanges().pipe(
        map(docArray => {
          return docArray.map(
              doc => {
                console.log('==doc id', {
                  id: doc.payload.doc.id,
                  ...doc.payload.doc.data() as {}
                });
                return {
                  id: doc.payload.doc.id,
                  ...doc.payload.doc.data() as {}
                }
              }
          )
        })
    );
  }

  async insertData(collectionId, data) {
      try {
          const result = await this.db.collection(collectionId).add(data);
          return result;
      } catch (error) {
          throw new Error(error);
      }
  }

  async getDataById(collectionId, docId) {
      try {
          const result = await this.db.collection(collectionId).doc(docId).ref.get();
          if (result.exists) {
              return result.data();
          } else {
              throw new Error('Data not found with given id');
          }
      } catch (error) {
          throw new Error(error);
      }
  }

  async updateData(collectionId, docId, updatedData) {

      try {
          const result = await this.db.doc(`${collectionId}/${docId}`).update(updatedData);
          return result;
      } catch (error) {
          throw new Error(error);
      }


  }


}
