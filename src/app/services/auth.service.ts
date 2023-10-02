import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth
  ) { }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  getUserEmail(): string | null {
    const user = this.auth.currentUser;
    return user?.email || null;
  }
}
