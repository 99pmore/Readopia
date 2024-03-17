import { Injectable } from '@angular/core';
import { DocumentData, Firestore, addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { User } from '@angular/fire/auth';
import { Review } from '../models/review.interface';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  user!: User | null

  private updatedReviewsSubject = new Subject<void>()
  public updatedReviews$ = this.updatedReviewsSubject.asObservable()

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
  ) {
    this.authService.authChanges().subscribe((user) => {
      this.user = user
    })
  }

  public async addReview(review: Review) {
    try {
      const reviewRef = collection(this.firestore, 'reviews')
      const reviewDoc = await addDoc(reviewRef, {
        userId: review.userId,
        bookId: review.bookId,
        bookTitle: review.bookTitle,
        rating: review.rating,
        comment: review.comment
      })

      updateDoc(reviewDoc, {
        id: reviewDoc.id
      })
      this.updatedReviewsSubject.next()
      
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error}`,
      })
    }
  }

  public async getTotalRating(bookId: string | undefined, apiRating: number | undefined, apiRatingCount: number | undefined) {
    if (bookId) {
      const reviews = await this.getReviews(bookId)
      const reviewsRatingSum = reviews.reduce((acc, review) => {
        return acc + (review.rating ?? 0)
      }, 0)
  
      const totalRatingCount = reviews.length + (apiRatingCount ?? 0)
      const rating = (reviewsRatingSum + ((apiRating ?? 0) * (apiRatingCount ?? 0))) / totalRatingCount
      return rating
    }

    return 0
  }

  public async getTotalRatingsCount(bookId: string | undefined, apiRatingCount: number | undefined) {
    if (bookId) {
      const reviews = await this.getReviews(bookId)
      const totalRatingCount = reviews.length + (apiRatingCount ?? 0)
      return totalRatingCount
    }

    return 0
  }

  public async getReviews(bookId: string): Promise<Review[]> {
    try {
      const reviewRef = collection(this.firestore, 'reviews')
      const q = query(reviewRef, where('bookId', '==', bookId))
      const querySnapshot = await getDocs(q)

      const reviews: Review[] = []

      querySnapshot.forEach((doc) => {
        const reviewData = doc.data()
        const review = this.convertToReview(reviewData)
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

  public async getUserReviews(userId: string): Promise<Review[]> {
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

  public deleteReview(reviewId: string) {
    const reviewRef = doc(this.firestore, `reviews/${reviewId}`)
    Swal.fire({
      title: '¿Estás seguro/a?',
      text: `Se eliminará tu reseña`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#90abc4',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
      
    })
    .then((result) => {
      if (result.isConfirmed) {
        deleteDoc(reviewRef)
      }
      this.updatedReviewsSubject.next()
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error}`,
      })
    })
  }

  private convertToReview(documentData: DocumentData): Review {
    return {
      id: documentData['id'],
      userId: documentData['userId'],
      bookId: documentData['bookId'],
      bookTitle: documentData['bookTitle'],
      rating: documentData['rating'],
      comment: documentData['comment'],
    }
  }
}
