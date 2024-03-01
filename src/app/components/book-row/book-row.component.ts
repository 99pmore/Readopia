import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { BookDB } from 'src/app/models/bookDB.interface';
import { RatingComponent } from '../rating/rating.component';
import { SmCoverComponent } from '../sm-cover/sm-cover.component';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookDbService } from 'src/app/services/book-db.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faPaintBrush, faBookOpen, faBook, faBookmark } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { ReviewsService } from 'src/app/services/reviews.service';

@Component({
    selector: 'app-book-row',
    templateUrl: './book-row.component.html',
    styleUrls: ['./book-row.component.scss'],
    standalone: true,
    imports: [NgFor, NgIf, NgClass, RatingComponent, SmCoverComponent, RouterLink, FontAwesomeModule]
})
export class BookRowComponent implements OnInit {
  
  @Input() book!: BookDB

  public option: string = ''
  public count!: number
  public rating!: number
  public moreThanOneAuthor!: boolean
  public showFullDescription: boolean = false

  private allBooks: BookDB[] = []

  public faEdit = faEdit
  public faPaintBrush = faPaintBrush
  public faBookOpen = faBookOpen
  public faBook = faBook
  public faBookmark = faBookmark

  constructor(
    private bookDBService: BookDbService,
    private reviewsService: ReviewsService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.getBookState()
    this.getRating()

    this.moreThanOneAuthor = this.book.authors ? this.book.authors.length > 1 : false
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isContentFullyVisible()
  }

  public isContentFullyVisible() {
    let div = this.getElementByClass('.description');
    let ps = div?.getElementsByTagName('p');
  
    let contentHeight = 0;
  
    if (ps) {
      for (let i = 0; i < ps?.length; i++) {
        contentHeight += ps[i].scrollHeight;
      }
    }
  
    let containerHeight = div?.clientHeight || 0;
    let containerScrollHeight = div?.scrollHeight || 0;
  
    return contentHeight <= containerHeight && contentHeight <= containerScrollHeight;
  }

  private getElementByClass(className: string): HTMLElement | null {
    return this.elementRef.nativeElement.querySelector(className)
  }

  public toggleDescription(): void {
    this.showFullDescription = !this.showFullDescription
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
