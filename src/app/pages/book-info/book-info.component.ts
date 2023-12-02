import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/models/book.interface';
import { BookService } from 'src/app/services/book.service';
import { FormsModule } from '@angular/forms';
import { RatingComponent } from '../../components/rating/rating.component';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';
import { AuthService } from 'src/app/services/auth.service';
import { ReviewComponent } from 'src/app/components/review/review.component';
import { User } from '@angular/fire/auth';
import { AddReviewComponent } from 'src/app/components/add-review/add-review.component';
import { ReviewsService } from 'src/app/services/reviews.service';
import { TwoDecimalsPipe } from 'src/app/pipes/two-decimals.pipe';
import { StateSelectorComponent } from 'src/app/components/state-selector/state-selector.component';

@Component({
    selector: 'app-book-info',
    templateUrl: './book-info.component.html',
    styleUrls: ['./book-info.component.scss'],
    standalone: true,
    imports: [MenuComponent, NgFor, NgIf, NgClass, RatingComponent, FormsModule, ReviewComponent, AddReviewComponent, StateSelectorComponent, TwoDecimalsPipe]
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
  public moreThanOneAuthor!: boolean

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
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

  private async getBook() {
    this.bookService.getBook(this.id)
    .subscribe(async (data) => {
      this.book = data

      this.rating = await this.reviewsService.getTotalRating(this.book.id, this.book.volumeInfo?.averageRating, this.book.volumeInfo?.ratingsCount)
      this.count = await this.reviewsService.getTotalRatingsCount(this.book.id, this.book.volumeInfo?.ratingsCount)

      this.moreThanOneAuthor = this.book.volumeInfo?.authors ? this.book.volumeInfo?.authors.length > 1 : false
    })
  }
}
