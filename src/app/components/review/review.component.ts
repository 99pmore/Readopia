import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from '../rating/rating.component';
import { ReviewsService } from 'src/app/services/reviews.service';
import { ActivatedRoute } from '@angular/router';
import { Review } from 'src/app/models/review.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, RatingComponent],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  
  reviews: Review[] = []
  name!: string | undefined
  lastName!: string | undefined
  userNames: { [key: string]: string } = {}

  constructor (
    private route: ActivatedRoute,
    private reviewsService: ReviewsService,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    const bookId = this.route.snapshot.paramMap.get('id')!
    if (bookId !== undefined) {
      this.reviews = await this.reviewsService.getReviews(bookId)
      this.getUser()
    }
  }

  async getUser() {
    this.reviews.map(async (review) => {
      if (review.userId) {
        const user = await this.userService.getUserById(review.userId)
        this.userNames[review.userId] = `${user.name} ${user.lastname}`
      }
    })
  }
}
