import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { BookDB } from 'src/app/models/bookDB.interface';
import { AuthService } from 'src/app/services/auth.service';
import { BookDbService } from 'src/app/services/book-db.service';
import { DbBookCardComponent } from '../../components/db-book-card/db-book-card.component';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [HeaderComponent, RouterLink, NgIf, NgFor, DbBookCardComponent]
})
export class HomeComponent implements OnInit {

  isUserLoggedIn: boolean = false
  user!: User | null

  readBooks: BookDB[] = []
  readingBooks: BookDB[] = []
  wishBooks: BookDB[] = []
  
  constructor(
    private authService: AuthService,
    private bookDBService: BookDbService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.isUserLoggedIn = this.authService.isLoggedIn()
    this.user = this.authService.getUser()

    await this.getBooks()
  }

  async getBooks() {
    try {
      this.readBooks = await this.bookDBService.getBooks('readBooks')
      this.readingBooks = await this.bookDBService.getBooks('readingBooks')
      this.wishBooks = await this.bookDBService.getBooks('wishBooks')

    } catch (error) {
      console.error('Error al obtener los libros leídos:', error)
    }
  }

}
