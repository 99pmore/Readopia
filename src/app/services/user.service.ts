import { Injectable, signal } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Firestore, collection, doc, getDoc, getDocs, setDoc, arrayUnion, updateDoc, arrayRemove } from '@angular/fire/firestore';
import { UserDB } from '../models/userDB.interface';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private updatedFollowersSubject = new Subject<void>()
  public updatedFollowers$ = this.updatedFollowersSubject.asObservable()

  public follows = signal<boolean>(false)
  
  constructor(
    private firestore: Firestore,
    private auth: Auth
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

  public async addFollow(followId: string) {
    const matchingUser = await this.isFollowing(followId)

    if (!matchingUser) {
      const userId = this.auth.currentUser?.uid
      if (userId) {

        // Siguiendo
        const userRef = doc(this.firestore, `users/${userId}`)
        await updateDoc(userRef, {
          following: arrayUnion(followId)
        })
        .then(() => {
          this.follows.set(true)
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `${error}`,
          })
        })
        
        // Seguidores
        const userRefFollow = doc(this.firestore, `users/${followId}`)
        await updateDoc(userRefFollow, {
          followers: arrayUnion(userId)
        })
        .then(() => {
          this.updatedFollowersSubject.next()
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `${error}`,
          })
        })

        // Swal
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Ahora sigues a este usuario`,
          showConfirmButton: false,
          timer: 1500
        })
  
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El usuario no está autenticado',
          footer: '<a href="/login">Iniciar sesión</a>'
        })
      }
    }
  }

  public async deleteFollowing(followId: string) {
    const userId = this.auth.currentUser?.uid
    if (userId) {

      // Siguiendo
      const userRef = doc(this.firestore, `users/${userId}`)
      await updateDoc(userRef, {
        following: arrayRemove(followId)
      })
      .then(() => {
        this.follows.set(false)
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `${error}`,
        })
      })

      // Seguidores
      const userRefFollow = doc(this.firestore, `users/${followId}`)
      await updateDoc(userRefFollow, {
        followers: arrayRemove(userId)
      })
      .then(() => {
        this.updatedFollowersSubject.next()
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `${error}`,
        })
      })

      // Swal
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Ya no sigues a este usuario`,
        showConfirmButton: false,
        timer: 1500
      })

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El usuario no está autenticado',
        footer: '<a href="/login">Iniciar sesión</a>'
      })
    }
  }

  private async isFollowing(followId: string) {
    const userId = this.auth.currentUser?.uid
    if (userId) {
      const user = await this.getUserById(userId)
      const following = user.following?.includes(followId) as boolean
      this.follows.set(following)

      return following
    }
    return false
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
