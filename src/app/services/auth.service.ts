import { Injectable, signal } from '@angular/core';
import { Auth, User, browserLocalPersistence, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut, updateEmail, updatePassword, updateProfile } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { UserDB } from '../models/userDB.interface';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: boolean = false
  user: User | null = null
  
  constructor(
    private auth: Auth,
    private router: Router,
    private userService: UserService
  ) {
    auth.setPersistence(browserLocalPersistence)
  }

  authChanges(): Observable<User | null> {
    return new Observable((observer) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        this.loggedIn = !!user
        this.user = user
        observer.next(user)
        
      }, (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `${error}`,
        })
      })
      return () => unsubscribe()
    })
  }

  login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
    .then(() => {
      this.loggedIn = true
      this.router.navigate(['/'])
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error}`,
      })
    })
  }
  
  register(photo: string, name: string, lastname: string, email: string, password: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user
      sendEmailVerification(user)
      
      if (user) {
        updateProfile(user, {
          displayName: `${name} ${lastname}`,
          photoURL: photo
        })
        .then(() => {
          this.userService.addUser(user)
          
          this.loggedIn = true
          this.router.navigate(['/'])
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `${error}`,
          })
        })
      }
      
    })
    .catch((error) => {
      console.log('Error en el registro: ', error)
    })
  }
  
  logout() {
    signOut(this.auth)
    .then(() => {
      this.loggedIn = false
      this.router.navigate(['/'])
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error}`,
      })
    })
  }

  editUser(name: string, lastname: string, photo: string) {
    const user = this.auth.currentUser

    if (user) {
      const newName = name !== '' ? name : user.displayName?.split(' ')[0]
      const newLastname = lastname !== '' ? lastname
                                          : user.displayName?.split(' ')[2]
                                          ? user.displayName?.split(' ')[1].concat(' ').concat(user.displayName?.split(' ')[2])
                                          : user.displayName?.split(' ')[1]
      const newDisplayName = `${newName} ${newLastname}`
      const newPhoto = photo !== '' ? photo : user.photoURL

      try {
        updateProfile(user, {
          displayName: newDisplayName,
          photoURL: newPhoto
        })
        .then(() => {
          this.userService.editUser(user.uid, newName, newLastname, newPhoto)
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
      }
    }
  }

  changePassword(password: string, passwordRep: string) {
    const user = this.auth.currentUser

    if (user) {
      if (password === passwordRep) {
        updatePassword(user, password)
        .then(() => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Contraseña actualizada',
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
  
      } else if (password !== passwordRep) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Las contraseñas no coinciden',
        })
      }
    }
  }
}
