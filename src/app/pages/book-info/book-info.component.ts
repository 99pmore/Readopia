import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/models/book.interface';
import { BookDB } from 'src/app/models/bookDB.interface';
import { BookDbService } from 'src/app/services/book-db.service';
import { BookService } from 'src/app/services/book.service';
import { FormsModule } from '@angular/forms';
import { RatingComponent } from '../../components/rating/rating.component';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { ReviewComponent } from 'src/app/components/review/review.component';
import { User } from '@angular/fire/auth';
import { AddReviewComponent } from 'src/app/components/add-review/add-review.component';
import { ReviewsService } from 'src/app/services/reviews.service';
import { TwoDecimalsPipe } from 'src/app/pipes/two-decimals.pipe';

@Component({
    selector: 'app-book-info',
    templateUrl: './book-info.component.html',
    styleUrls: ['./book-info.component.scss'],
    standalone: true,
    imports: [MenuComponent, NgFor, NgIf, NgClass, RatingComponent, FormsModule, FontAwesomeModule, ReviewComponent, AddReviewComponent, TwoDecimalsPipe]
})
export class BookInfoComponent implements OnInit {

  public formVisible: boolean = false
  public buttonText: string = 'Crear reseña'

  public user!: User
  private userLoggedIn: boolean = false
  
  public book!: Book
  public id!: string
  public count!: number
  public rating!: number
  private allBooks: BookDB[] = []

  public selected: string = ''
  public option: string = ''

  public hasBook = this.bookDBService.hasBook
  public moreThanOneAuthor!: boolean

  public faTrash = faTrash

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private bookDBService: BookDbService,
    private authService: AuthService,
    private reviewsService: ReviewsService
  ) { 
    this.book = {
      volumeInfo: {}
    }
  }
  
  ngOnInit(): void {
    this.authService.authChanges().subscribe((user) => {
      this.user = user as User
      this.userLoggedIn = !!user

      this.id = this.route.snapshot.paramMap.get('id')!
      this.getBook()

      if (this.userLoggedIn) {
        this.getBookState()

        this.reviewsService.updatedReviews$.subscribe(async () => {
          this.rating = await this.reviewsService.getTotalRating(this.book.id, this.book.volumeInfo?.averageRating, this.book.volumeInfo?.ratingsCount);
          this.count = await this.reviewsService.getTotalRatingsCount(this.book.id, this.book.volumeInfo?.ratingsCount);
        })
      }
    })
  }

  public toggleForm() {
    this.formVisible = !this.formVisible
    this.buttonText = this.formVisible ? 'Cerrar' : 'Crear reseña'
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

  private async getBook() {
    this.bookService.getBook(this.id)
    .subscribe(async (data) => {
      this.book = data

      this.rating = await this.reviewsService.getTotalRating(this.book.id, this.book.volumeInfo?.averageRating, this.book.volumeInfo?.ratingsCount)
      this.count = await this.reviewsService.getTotalRatingsCount(this.book.id, this.book.volumeInfo?.ratingsCount)

      this.moreThanOneAuthor = this.book.volumeInfo?.authors ? this.book.volumeInfo?.authors.length > 1 : false
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
