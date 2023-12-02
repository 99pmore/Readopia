import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookDB } from 'src/app/models/bookDB.interface';
import { BookService } from 'src/app/services/book.service';
import { BookDbService } from 'src/app/services/book-db.service';
import { AuthService } from 'src/app/services/auth.service';
import { Book } from 'src/app/models/book.interface';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-state-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './state-selector.component.html',
  styleUrls: ['./state-selector.component.scss']
})
export class StateSelectorComponent implements OnInit {

  @Input() book!: Book
  
  public hasBook = this.bookDBService.hasBook
  public selected: string = ''
  public option: string = ''
  public id!: string
  
  private userLoggedIn: boolean = false
  private allBooks: BookDB[] = []

  public faTrash = faTrash

  constructor(
    private bookService: BookService,
    private bookDBService: BookDbService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { 
    this.book = {
      volumeInfo: {}
    }
  }

  ngOnInit(): void {
    this.authService.authChanges().subscribe((user) => {
      this.userLoggedIn = !!user
      this.id = this.route.snapshot.paramMap.get('id')!

      if (this.userLoggedIn) {
        this.getBookState()
      }
    })
  }

  public async deleteBook() {
    let bookList!: string

    this.allBooks = await this.bookDBService.getAllBooks()
    const matchingBook = this.allBooks.find((book) => book.id === this.book.id)

    if (matchingBook) {
      if (matchingBook.state === 'reading') {
        bookList = 'readingBooks'
        
      } else if (matchingBook.state === 'read') {
        bookList = 'readBooks'
        
      } else if (matchingBook.state === 'wish') {
        bookList = 'wishBooks'

      }

    } else {
      bookList = ''
    }

    this.bookDBService.deleteBook(matchingBook as BookDB, bookList, true)
    .then(() => {
      this.selected = ''
    })
  }

  public addBookToList() {
    if (this.selected === 'read') {
      this.read()

    } else if (this.selected === 'reading') {
      this.reading()

    } else if (this.selected === 'wish') {
      this.wish()
    }
  }
  
  private read() {
    const bookDB = this.setBook('read')
    this.bookDBService.addBook(bookDB, 'readBooks')
  }

  private reading() {
    const bookDB = this.setBook('reading')
    this.bookDBService.addBook(bookDB, 'readingBooks')
  }

  private wish() {
    const bookDB = this.setBook('wish')
    this.bookDBService.addBook(bookDB, 'wishBooks')
  }

  private async getBookState() {
    try {
      this.allBooks = await this.bookDBService.getAllBooks()
      
      const matchingBook = this.allBooks.find((book) => book.id === this.id)
  
      if (matchingBook) {
        if (matchingBook.state === 'reading') {
          this.option = 'reading'
          
        } else if (matchingBook.state === 'read') {
          this.option = 'read'
          
        } else if (matchingBook.state === 'wish') {
          this.option = 'wish'

        }

        this.hasBook.set(true)

      } else {
        this.option = ''
        this.hasBook.set(false)
      }
  
    } catch (error) {
      console.log('Error al obtener los libros del usuario:', error)
    }
  }

  private setBook(state: string): BookDB {
    this.bookService.getBook(this.id).subscribe((data) => {
      this.book = data
    })

    const bookDB: BookDB = {
      id: this.id,
      cover: this.book.volumeInfo?.imageLinks?.thumbnail || '',
      title: this.book.volumeInfo?.title || '',
      authors: this.book.volumeInfo?.authors || [],
      categories: this.book.volumeInfo?.categories || [],
      rating: this.book.volumeInfo?.averageRating || 0,
      ratingCount: this.book.volumeInfo?.ratingsCount || 0,
      description: this.book.volumeInfo?.description || '',
      state: state,
    }

    return bookDB
  }
}
