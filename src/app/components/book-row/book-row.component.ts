import { Component, Input, OnInit } from '@angular/core';
import { BookDB } from 'src/app/models/bookDB.interface';
import { RatingComponent } from '../rating/rating.component';
import { SmCoverComponent } from '../sm-cover/sm-cover.component';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookDbService } from 'src/app/services/book-db.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import Swal from 'sweetalert2';
import { ReviewsService } from 'src/app/services/reviews.service';

@Component({
    selector: 'app-book-row',
    templateUrl: './book-row.component.html',
    styleUrls: ['./book-row.component.scss'],
    standalone: true,
    imports: [NgFor, NgIf, RatingComponent, SmCoverComponent, RouterLink, FontAwesomeModule]
})
export class BookRowComponent implements OnInit {
  
  @Input() book!: BookDB

  private allBooks: BookDB[] = []
  public option: string = ''
  public count!: number
  public rating!: number

  public faEdit = faEdit

  constructor(
    private bookDBService: BookDbService,
    private reviewsService: ReviewsService,
  ) {}

  ngOnInit(): void {
    this.getBookState()
    this.getRating()
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

    this.bookDBService.deleteBook(this.book, bookList, true)
  }

  private async getBookState() {
    try {
      this.allBooks = await this.bookDBService.getAllBooks()
      const matchingBook = this.allBooks.find((book) => book.id === this.book.id)
  
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error}`,
      })
    }
  }

  private async getRating() {
    this.rating = await this.reviewsService.getTotalRating(this.book.id, this.book.rating, this.book.ratingCount)
    this.count = await this.reviewsService.getTotalRatingsCount(this.book.id, this.book.ratingCount)
  }
}
