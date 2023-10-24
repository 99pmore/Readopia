import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { LoginLinkComponent } from 'src/app/components/login-link/login-link.component';
import { SmCoverComponent } from 'src/app/components/sm-cover/sm-cover.component';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '@angular/fire/auth';
import { BookDB } from 'src/app/models/bookDB.interface';
import { BookDbService } from 'src/app/services/book-db.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MenuComponent, LoginLinkComponent, SmCoverComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userLoggedIn: boolean = false
  user!: User | null

  userId!: string | undefined
  fullName!: string | undefined
  email!: string | undefined

  readBooks: BookDB[] = []
  readingBooks: BookDB[] = []
  wishBooks: BookDB[] = []
  
  constructor (
    private userService: UserService,
    private authService: AuthService,
    private bookDBService: BookDbService
  ) {}

  ngOnInit(): void {
    this.getUser()
  }

  private getUser() {
    this.authService.authChanges().subscribe((user) => {
      this.user = user
      this.userLoggedIn = !!user
      this.userId = user?.uid

      this.getUserData()

      if (this.userLoggedIn) {
        this.getUserBooks()
      }
    })
  }

  private getUserData() {
    if (this.userId) {
      this.userService.getUserById(this.userId).then((user) => {
        const name = user.name
        const lastName = user.lastname
        this.fullName = `${name} ${lastName}`
        this.email = user.email
      })
    }
  }

  private async getUserBooks() {
    try {
      this.readBooks = await this.bookDBService.getUserBooks('readBooks')
      this.readingBooks = await this.bookDBService.getUserBooks('readingBooks')
      this.wishBooks = await this.bookDBService.getUserBooks('wishBooks')

      this.readBooks.reverse()
      this.readingBooks.reverse()
      this.wishBooks.reverse()

    } catch (error) {
      console.error('Error al obtener los libros leídos:', error)
    }
  }

}
