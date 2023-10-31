import { Injectable } from '@angular/core';
import { DocumentData, Firestore, addDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { User } from '@angular/fire/auth';
import { Review } from '../models/review.interface';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  user!: User | null

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
  ) {
    this.authService.authChanges().subscribe((user) => {
      this.user = user
    })
  }

  async addReview(review: Review) {
    const reviewRef = collection(this.firestore, 'reviews')

    try {
      return await addDoc(reviewRef, {
        userId: review.userId,
        bookId: review.bookId,
        bookTitle: review.bookTitle,
        rating: review.rating,
        comment: review.comment
      })
      
    } catch (error) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error}`,
      })
    }
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error}`,
      })
      throw error
    }
  }

  async getUserReviews(userId: string): Promise<Review[]> {
    try {
      const reviewRef = collection(this.firestore, 'reviews')
      const q = query(reviewRef, where('userId', '==', userId))
      const querySnapshot = await getDocs(q)

      const reviews: Review[] = []

      querySnapshot.forEach((doc) => {
        const reviewData = doc.data();
        const review = this.convertToReview(reviewData);
        reviews.push(review)
      })

      return reviews

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error}`,
      })
      throw error
    }
  }

  private convertToReview(documentData: DocumentData): Review {
    return {
      userId: documentData['userId'],
      bookId: documentData['bookId'],
      bookTitle: documentData['bookTitle'],
      rating: documentData['rating'],
      comment: documentData['comment'],
    }
  }
}
