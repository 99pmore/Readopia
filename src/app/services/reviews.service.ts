import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { User } from '@angular/fire/auth';
import { Review } from '../models/review.interface';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  user!: User | null

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {
    this.authService.authChanges().subscribe((user) => {
      this.user = user
    })
  }

  addReview(review: Review) {
    const reviewRef = collection(this.firestore, 'reviews')

    return addDoc(reviewRef, {
      userId: review.userId,
      bookId: review.bookId,
      rating: review.rating,
      comment: review.comment
    })
  }
}
