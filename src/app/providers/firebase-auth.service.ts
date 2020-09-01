import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  constructor(private angularFireAuth: AngularFireAuth) { }

  async registerWithEmailPassword(email, password) {
    try {
      //const provider = new auth.GoogleAuthProvider();
      //const result = await this.angularFireAuth.signInWithPopup(provider);

      //const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
      //const currentUser = await firebase.auth().currentUser.sendEmailVerification();

      const result = await this.angularFireAuth.createUserWithEmailAndPassword(email, password);

      const currentUser = await this.angularFireAuth.currentUser;
      await currentUser.sendEmailVerification();

      // firebase.auth().onAuthStateChanged(function(user) {
      //   if (user) {
      //     console.log('User is signed in and currentUser will no longer return null.')
      //   } else {
      //     console.log('No user is signed in.')
      //   }
      // });

      return result;

    } catch (error) {
      throw new Error(error);
    }
  }
}
