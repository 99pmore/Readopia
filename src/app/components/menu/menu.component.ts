import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { User } from '@angular/fire/auth';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';

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
  photo!: string | null | undefined

  userSubscription!: Subscription

  faLogout = faArrowRightFromBracket

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.authService.authChanges().subscribe((user) => {
      this.userLoggedIn = !!user
      
      if (user) {
        this.getUser(user.uid)
      }

      this.userSubscription = this.authService.userUpdated$
      .subscribe((user) => {
        if (user) {
          this.getUser(user.uid)
        }
      })
    })
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe()
    }
  }

  public logout() {
    this.authService.logout()
  }

  private getUser(id: string) {
    this.userService.getUserById(id)
    .then((user) => {
      this.id = user.id
      this.name = user.name
      this.photo = user.photo
    })
  }
}
