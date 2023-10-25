import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { User } from '@angular/fire/auth';
import { RouterLink } from '@angular/router';
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

  userLoggedIn: boolean = false
  user!: User | null
  id!: string | undefined
  name!: string | null | undefined

  faLogout = faArrowRightFromBracket

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.authChanges().subscribe((user) => {
      this.userLoggedIn = !!user
      this.user = user
      this.id = user?.uid
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
