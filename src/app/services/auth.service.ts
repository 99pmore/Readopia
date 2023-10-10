import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth
  ) { }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser
  }

  getUser(): User | null {
    return this.auth.currentUser
  }
}
