import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Book } from 'src/app/models/book.interface';
import { AuthService } from 'src/app/services/auth.service';
import { BookDbService } from 'src/app/services/book-db.service';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isUserLoggedIn: boolean = false
  userEmail!: string | null

  readBooksIDs!: string[]
  readBooks!: Book[]
  
  constructor(
    private authService: AuthService,
    private bookDBService: BookDbService,
    private bookService: BookService
  ) {}

  async ngOnInit(): Promise<void> {
    this.isUserLoggedIn = this.authService.isLoggedIn()
    this.userEmail = this.authService.getUserEmail()

    await this.getReadBooksIDs()
    this.getBooks()
  }

  async getReadBooksIDs() {
    try {
      this.readBooksIDs = await this.bookDBService.getReadBooks()

    } catch (error) {
      console.error('Error al obtener los libros leídos:', error)
    }
  }

  getBooks() {
    if (this.readBooksIDs) {
      const requests = this.readBooksIDs.map((bookId) =>
        this.bookService.getBook(bookId)
      )
  
      forkJoin(requests)
        .subscribe((booksArray) => {
          this.readBooks = booksArray
  
          console.log(this.readBooks)
        }, (error) => {
          console.error('Error al obtener los detalles de los libros:', error)
        })
    }
  }

}
