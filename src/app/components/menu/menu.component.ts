import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  userEmail!: string | null

  faLogout = faArrowRightFromBracket

  constructor(
    private authService: AuthService,
    private auth: Auth,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail()
  }

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/'])
    }).catch((error) => {
      console.log('Error cerrando sesión: ', error)
    })
  }
}
