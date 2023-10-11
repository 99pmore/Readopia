import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Auth, User, signOut } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';
import { UserDB } from 'src/app/models/userDB.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    standalone: true,
    imports: [RouterLink, NgIf, FontAwesomeModule]
})
export class MenuComponent implements OnInit {

  userLoggedIn: boolean = false
  user!: User | null
  name!: string | null | undefined

  faLogout = faArrowRightFromBracket

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.authChanges().subscribe((user) => {
      this.userLoggedIn = !!user
      this.user = user
      this.name = this.getName()
    })
  }

  logout() {
    this.authService.logout()
  }

  private getName(): string | undefined {
    return this.user?.displayName?.split(' ')[0]
  }
}
