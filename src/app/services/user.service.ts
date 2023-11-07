import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Firestore, collection, doc, getDoc, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';
import { UserDB } from '../models/userDB.interface';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(
    private firestore: Firestore,
  ) { }

  public async addUser(user: User) {
    const userRef = doc(this.firestore, 'users', user.uid)
    const lastname = user.displayName?.split(' ')[2] ? user.displayName?.split(' ')[1].concat(' ', user.displayName.split(' ')[2]) : user.displayName?.split(' ')[1]

    try {
      return await setDoc(userRef, {
        id: user.uid,
        name: user.displayName?.split(' ')[0],
        lastname: lastname,
        email: user.email,
        photo: user.photoURL,
        readBooks: [],
        readingBooks: [],
        wishBooks: [],
        favorites: [],
        following: [],
        followers: []
      })

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error}`,
      })
    }
  }

  public async getUsers(): Promise<UserDB[]> {
    try {
      const usersRef = collection(this.firestore, 'users')
      const querySnapshot = await getDocs(usersRef)

      const users: UserDB[] = []
      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          const userData = doc.data()
          users.push(userData)
        }
      })

      return users

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error}`,
      })
      throw error
    }
  }

  public async getUserById(userId: string): Promise<UserDB> {
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error}`,
      })
      throw(error)
    }
  }

  public editUser(userId: string, name: string | undefined, lastname: string | undefined, photo: string | null) {
    const userRef = doc(this.firestore, 'users', userId)

    try {
      updateDoc(userRef, {
        name: name,
        lastname: lastname,
        photo: photo
      })
      .then(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Datos actualizados',
          showConfirmButton: false,
          timer: 1500
        })
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `${error}`,
        })
      })

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error}`,
      })
      throw(error)
    }
  }
}
