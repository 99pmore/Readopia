import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/models/book.interface';
import { BookDB } from 'src/app/models/bookDB.interface';
import { BookDbService } from 'src/app/services/book-db.service';
import { BookService } from 'src/app/services/book.service';
import { FormsModule } from '@angular/forms';
import { RatingComponent } from '../../components/rating/rating.component';
import { NgFor } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
    selector: 'app-book-info',
    templateUrl: './book-info.component.html',
    styleUrls: ['./book-info.component.scss'],
    standalone: true,
    imports: [MenuComponent, NgFor, RatingComponent, FormsModule]
})
export class BookInfoComponent implements OnInit {

  book!: Book
  id!: string
  allBooks: BookDB[] = []

  public selected: string = ''
  public option: string = ''

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private bookDBService: BookDbService
  ) { 
    this.book = {
      volumeInfo: {}
    }
  }
  
  async ngOnInit(): Promise<void> {
    await this.getBook()
    await this.getBookState()
  }

  addBookToList() {
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

  private async getBook() {
    this.id = this.route.snapshot.paramMap.get('id')!
    this.bookService.getBook(this.id).subscribe((data) => {
      this.book = data
    })
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

      } else {
        this.option = ''
      }
  
    } catch (error) {
      console.log('Error al obtener los libros del usuario:', error)
    }
  }

  private setBook(state: string): BookDB {
    this.id = this.route.snapshot.paramMap.get('id')!

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
      description: this.book.volumeInfo?.description || '',
      state: state,
    }

    return bookDB
  }

}
