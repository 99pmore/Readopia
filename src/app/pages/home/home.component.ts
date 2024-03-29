import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { BookDB } from 'src/app/models/bookDB.interface';
import { AuthService } from 'src/app/services/auth.service';
import { BookDbService } from 'src/app/services/book-db.service';
import { BookCardComponent } from 'src/app/components/book-card/book-card.component';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { LoginLinkComponent } from 'src/app/components/login-link/login-link.component';
import { CarouselComponent } from 'src/app/components/carousel/carousel.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [HeaderComponent, RouterLink, NgIf, NgFor, BookCardComponent, LoginLinkComponent, CarouselComponent]
})
export class HomeComponent implements OnInit {

  userLoggedIn: boolean = false
  user!: User | null

  readBooks: BookDB[] = []
  readingBooks: BookDB[] = []
  wishBooks: BookDB[] = []
  
  constructor(
    private authService: AuthService,
    private bookDBService: BookDbService,
  ) {}

  ngOnInit(): void {
    this.authService.authChanges().subscribe((user) => {
      this.user = user
      this.userLoggedIn = !!user

      if (this.userLoggedIn) {
        this.getUserBooks()
      }
    })
  }

  async getUserBooks() {
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
