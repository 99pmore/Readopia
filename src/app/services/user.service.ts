import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Firestore, collection, doc, getDoc, getDocs, setDoc, arrayUnion, updateDoc, arrayRemove } from '@angular/fire/firestore';
import { UserDB } from '../models/userDB.interface';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) { }

  async addUser(user: User) {
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

  async getUsers(): Promise<UserDB[]> {
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error}`,
      })
      throw(error)
    }
  }

  async addFollow(followId: string) {
    const matchingUser = await this.isFollowing(followId)

    if (!matchingUser) {
      const userId = this.auth.currentUser?.uid
      if (userId) {
        const userRef = doc(this.firestore, `users/${userId}`)
        await updateDoc(userRef, {
          following: arrayUnion(followId)
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `${error}`,
          })
        })

        const userRefFollow = doc(this.firestore, `users/${followId}`)
        await updateDoc(userRefFollow, {
          followers: arrayUnion(userId)
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `${error}`,
          })
        })

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Usuario seguido`,
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

  async isFollowing(followId: string): Promise<boolean> {
    const userId = this.auth.currentUser?.uid
    if (userId) {
      const user = await this.getUserById(userId)
      return user.following?.includes(followId) || false
    }

    return false
  }

  async deleteFollowing(followId: string) {
    Swal.fire({
      title: '¿Estás seguro/a?',
      text: `Dejarás de seguir a este usuario`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9e9682',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
      
    }).then(async (result) => {
      if (result.isConfirmed) {
        const userId = this.auth.currentUser?.uid
        if (userId) {
          const userRef = doc(this.firestore, `users/${userId}`)
          await updateDoc(userRef, {
            following: arrayRemove(followId)
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `${error}`,
            })
          })

          const userRefFollow = doc(this.firestore, `users/${followId}`)
          await updateDoc(userRefFollow, {
            followers: arrayRemove(userId)
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `${error}`,
            })
          })
    
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El usuario no está autenticado',
            footer: '<a href="/login">Iniciar sesión</a>'
          })
        }
    
        Swal.fire(
          '',
          'Has dejado de seguir a este usuario',
          'success'
        )
      }
    })
  }

  editUser(userId: string, name: string | undefined, lastname: string | undefined, photo: string | null) {
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
