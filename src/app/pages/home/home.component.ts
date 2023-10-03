import { Component, OnInit } from '@angular/core';
import { BookDB } from 'src/app/models/bookDB.interface';
import { AuthService } from 'src/app/services/auth.service';
import { BookDbService } from 'src/app/services/book-db.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isUserLoggedIn: boolean = false
  userEmail!: string | null

  readBooks: BookDB[] = []
  readingBooks: BookDB[] = []
  wishBooks: BookDB[] = []
  
  constructor(
    private authService: AuthService,
    private bookDBService: BookDbService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.isUserLoggedIn = this.authService.isLoggedIn()
    this.userEmail = this.authService.getUserEmail()

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
