import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/models/book.interface';
import { BookDB } from 'src/app/models/bookDB.interface';
import { BookDbService } from 'src/app/services/book-db.service';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-book-info',
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.scss']
})
export class BookInfoComponent implements OnInit {

  book!: Book
  id!: string

  public selectedOption: string = ''

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private bookDBService: BookDbService
  ) { 
    this.book = {
      volumeInfo: {}
    }
  }

  ngOnInit(): void {
    this.getBook()
  }
  
  read() {
    const bookDB = this.setBook()
    this.bookDBService.addBook(bookDB, 'readBooks')
  }

  reading() {
    const bookDB = this.setBook()
    this.bookDBService.addBook(bookDB, 'readingBooks')
  }

  wish() {
    const bookDB = this.setBook()
    this.bookDBService.addBook(bookDB, 'wishBooks')
  }

  private getBook() {
    this.id = this.route.snapshot.paramMap.get('id')!
    this.bookService.getBook(this.id).subscribe((data) => {
      this.book = data
    })
  }

  private setBook(): BookDB {
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
      state: 'wish',
    }

    return bookDB
  }

}
