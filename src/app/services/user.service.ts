import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Firestore, addDoc, collection, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { UserDB } from '../models/userDB.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) { }

  addUser(user: User) {
    const userRef = doc(this.firestore, 'users', user.uid)
    return setDoc(userRef, {
      name: user.displayName?.split(' ')[0],
      lastname: user.displayName?.split(' ')[1].concat(' ', user.displayName.split(' ')[2]),
      email: user.email,
      readBooks: [],
      readingBooks: [],
      wishBooks: [],
      favorites: []
    })
  }

  async getUser(): Promise<UserDB> {
    try {
      const user = this.auth.currentUser

      if (user) {
        const userRef = doc(this.firestore, `users/${user.uid}`)
        const userDoc = getDoc(userRef)

        if ((await userDoc).exists()) {
          const userData = (await userDoc).data()

          if (userData && userData) {
            return userData
          }
        }
      }

      return {}

    } catch (error) {
      console.log('Error al obtener los usuarios: ', error)
      throw(error)
    }
  }
}
