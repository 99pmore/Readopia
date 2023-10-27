import { Injectable, signal } from '@angular/core';
import { Auth, User, browserLocalPersistence, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

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
        console.error('Error en la autenticación', error)
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
      console.log(error)
    })
  }
  
  register(photo: string, name: string, lastname: string, email: string, password: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user
      
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
          console.log('Error añadiento datos del usuario: ', error)
        })
      }
      
    })
    .catch((error) => {
      console.log('Error en el registro: ', error)
    })
  }
  
  logout() {
    signOut(this.auth).then(() => {
      this.loggedIn = false
      this.router.navigate(['/'])
    })
    .catch((error) => {
      console.log('Error cerrando sesión: ', error)
    })
  }
}
