import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Firestore, doc } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { ReviewsService } from 'src/app/services/reviews.service';
import { User } from '@angular/fire/auth';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar as faStarSol } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarReg } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.scss']
})
export class AddReviewComponent implements OnInit {

  @Input() bookId!: string
  @Input() user!: User

  faStarSol = faStarSol
  faStarReg = faStarReg

  selectedRating: number = 0

  constructor (
    private fb: FormBuilder,
    private reviewService: ReviewsService,
    private firestore: Firestore,
  ) {}
  
  reviewForm!: FormGroup

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required]],
      comment: ['', [Validators.required]],
    })
  }

  setRating(rating: number) {
    this.selectedRating = rating
  }

  addReview() {
    const userRef = doc(this.firestore, 'users', this.user.uid)
    const bookId = this.bookId

    const review = {
      userId: userRef,
      bookId: bookId,
      rating: this.selectedRating,
      comment: this.reviewForm.get('comment')?.value
    }

    this.reviewService.addReview(review)

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Tu reseña se ha publicado',
      showConfirmButton: false,
      timer: 1500
    })

    this.reviewForm.reset()
    this.selectedRating = 0
  }
}
