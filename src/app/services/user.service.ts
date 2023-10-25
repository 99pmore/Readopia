import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
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

    const lastname = user.displayName?.split(' ')[2] ? user.displayName?.split(' ')[1].concat(' ', user.displayName.split(' ')[2]) : user.displayName?.split(' ')[1]

    return setDoc(userRef, {
      id: user.uid,
      name: user.displayName?.split(' ')[0],
      lastname: lastname,
      email: user.email,
      readBooks: [],
      readingBooks: [],
      wishBooks: [],
      favorites: [],
      following: [],
      followers: []
    })
  }

  async getUserById(userId: string): Promise<UserDB> {
    try {
      if (userId) {
        const userRef = doc(this.firestore, `users/${userId}`)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
          const userData = userDoc.data()
          return userData
        }
      }

      return {}

    } catch (error) {
      console.log('Error al obtener los usuarios: ', error)
      throw(error)
    }
  }
}
