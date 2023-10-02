import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Firestore, addDoc, collection, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: Firestore
  ) { }

  addUser(user: User) {
    const userRef = doc(this.firestore, 'users', user.uid)
    return setDoc(userRef, {
      email: user.email,
      readBooks: [],
      readingBooks: [],
      wishBooks: []
    })
  }
}
