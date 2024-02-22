import { Injectable } from '@angular/core';
import { Auth, User, browserLocalPersistence, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut, updateEmail, updatePassword, updateProfile } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userUpdatedSubject = new Subject<User>()
  public userUpdated$ = this.userUpdatedSubject.asObservable()
  
  constructor(
    private auth: Auth,
    private router: Router,
    private userService: UserService
  ) {
    auth.setPersistence(browserLocalPersistence)
  }

  public authChanges(): Observable<User | null> {
    return new Observable((observer) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
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

  public login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
    .then(() => {
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
  
  public register(photo: string, name: string, lastname: string, email: string, password: string) {
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error}`,
      })
    })
  }
  
  // public logout() {
  //   signOut(this.auth)
  //   .then(() => {
  //     this.router.navigate(['/'])
  //   })
  //   .catch((error) => {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: `${error}`,
  //     })
  //   })
  // }

  public logout() {
    Swal.fire({
      title: '¿Estás seguro/a?',
      text: `Se cerrará tu sesión`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#90abc4',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cerrar sesión',
      cancelButtonText: 'Cancelar'    
    })
    .then((result) => {
      if (result.isConfirmed) {
        signOut(this.auth)
        this.router.navigate(['/'])
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error}`,
      })
    })
  }

  public editUser(name: string, lastname: string, photo: string) {
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
          this.userUpdatedSubject.next(user)
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

  public changePassword(password: string, passwordRep: string) {
    const user = this.auth.currentUser

    if (user) {
      if (password === passwordRep) {
        updatePassword(user, password)
        .then(() => {
          Swal.fire({
            toast: true,
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
