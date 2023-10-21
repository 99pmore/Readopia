import { Injectable } from '@angular/core';
import { DocumentData, Firestore, addDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Auth, User } from '@angular/fire/auth';
import { Review } from '../models/review.interface';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  user!: User | null

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private auth: Auth
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

  async getReviews(bookId: string): Promise<Review[]> {
    try {
      const reviewRef = collection(this.firestore, 'reviews')
      const q = query(reviewRef, where('bookId', '==', bookId))
      const querySnapshot = await getDocs(q)

      const reviews: Review[] = []

      querySnapshot.forEach((doc) => {
        const reviewData = doc.data();
        const review = this.convertToReview(reviewData);
        reviews.push(review)
      })

      return reviews

    } catch (error) {
      console.log('Error al obtener las reviews: ', error)
      throw error
    }
  }

  private convertToReview(documentData: DocumentData): Review {
    return {
      userId: documentData['userId'],
      bookId: documentData['bookId'],
      rating: documentData['rating'],
      comment: documentData['comment'],
    }
  }
}
