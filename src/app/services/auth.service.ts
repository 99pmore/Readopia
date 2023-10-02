import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Auth, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) { }

  addUser(user: User) {
    const userRef = collection(this.firestore, 'users')
    return addDoc(userRef, {
      uid: user.uid,
      email: user.email
    })
  }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  getUserEmail(): string | null {
    const user = this.auth.currentUser;
    return user?.email || null;
  }
}
