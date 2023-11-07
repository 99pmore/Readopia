import { Injectable, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, arrayRemove, arrayUnion, doc, updateDoc } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  private updatedFollowersSubject = new Subject<void>()
  public updatedFollowers$ = this.updatedFollowersSubject.asObservable()

  private updatedFollowingSubject = new Subject<void>()
  public updatedFollowing$ = this.updatedFollowingSubject.asObservable()

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private userService: UserService
  ) { }

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
          this.updatedFollowingSubject.next()
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
        this.updatedFollowingSubject.next()
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

  public async isFollowing(followId: string) {
    const userId = this.auth.currentUser?.uid
    if (userId) {
      const user = await this.userService.getUserById(userId)
      const following = user.following?.includes(followId) as boolean
      // this.follows.set(following)

      return following
    }
    return false
  }
}
