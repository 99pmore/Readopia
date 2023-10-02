import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth: any
  constructor(
    // private auth: AngularFireAuth
  ) { }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  async getUserEmail(): Promise<string | null> {
    const user = await this.auth.currentUser;
    return user ? user.email : null;
  }
}
