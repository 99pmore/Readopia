import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from '../rating/rating.component';
import { ReviewsService } from 'src/app/services/reviews.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Review } from 'src/app/models/review.interface';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, RatingComponent, RouterLink],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit, OnDestroy {
  
  bookId!: string

  reviews: Review[] = []
  name!: string | undefined
  lastName!: string | undefined
  userNames: { [key: string]: string } = {}
  userPhotos: { [key: string]: string } = {}

  authId!: string | undefined

  private reviewsSubscription!: Subscription

  constructor (
    private route: ActivatedRoute,
    private reviewsService: ReviewsService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.authService.authChanges().subscribe((user) => {
      this.authId = user?.uid
    })

    this.bookId = this.route.snapshot.paramMap.get('id')!

    if (this.bookId !== undefined) {
      this.getReviews()

      this.reviewsSubscription = this.reviewsService.updatedReviews$
      .subscribe(async () => {
        this.getReviews()
      })

    }
  }

  ngOnDestroy(): void {
    if (this.reviewsSubscription) {
      this.reviewsSubscription.unsubscribe()
    }
  }

  public deleteReview(reviewId: string | undefined) {
    if (reviewId) this.reviewsService.deleteReview(reviewId)
  }

  private async getReviews() {
    this.reviews = await this.reviewsService.getReviews(this.bookId)
    this.getUser()
  }

  private async getUser() {
    this.reviews.map(async (review) => {
      if (review.userId) {
        const user = await this.userService.getUserById(review.userId)

        this.userNames[review.userId] = `${user.name} ${user.lastname}`
        if (user.photo) this.userPhotos[review.userId] = user.photo
      }
    })
  }
}
