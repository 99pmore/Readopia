import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Auth, User, signOut } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    standalone: true,
    imports: [RouterLink, NgIf, FontAwesomeModule]
})
export class MenuComponent implements OnInit {

  user!: User | null
  name!: string | undefined

  faLogout = faArrowRightFromBracket

  constructor(
    private authService: AuthService,
    private auth: Auth,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser()
    this.name = this.getName()
  }

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/'])
    }).catch((error) => {
      console.log('Error cerrando sesión: ', error)
    })
  }

  private getName(): string | undefined {
    return this.user?.displayName?.split(' ')[0]
  }
}
