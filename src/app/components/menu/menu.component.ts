import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { faArrowRightFromBracket, faBars } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgIf, NgClass } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    standalone: true,
    imports: [RouterLink, NgIf, FontAwesomeModule, NgClass]
})
export class MenuComponent implements OnInit, OnDestroy {

  public userLoggedIn: boolean = false
  public id!: string | undefined
  public name!: string | null | undefined
  public photo!: string | null | undefined

  public showMobileMenu: boolean = false

  private userSubscription!: Subscription

  public faLogout = faArrowRightFromBracket
  public faBars = faBars

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

  public toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu
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
