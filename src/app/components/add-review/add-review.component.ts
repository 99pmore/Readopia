import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  @Input() bookTitle!: string | undefined
  @Input() user!: User

  faStarSol = faStarSol
  faStarReg = faStarReg

  selectedRating: number = 0

  constructor (
    private fb: FormBuilder,
    private reviewService: ReviewsService,
  ) {}
  
  reviewForm!: FormGroup

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required]],
      comment: ['', [Validators.required]],
    })
  }

  public setRating(rating: number) {
    this.selectedRating = rating
  }

  public addReview() {
    const userId = this.user.uid
    const bookId = this.bookId
    const bookTitle = this.bookTitle as string

    const review = {
      userId: userId,
      bookId: bookId,
      bookTitle: bookTitle,
      rating: this.selectedRating,
      comment: this.reviewForm.get('comment')?.value
    }

    this.reviewService.addReview(review)

    Swal.fire({
      toast: true,
      position: 'center-end',
      icon: 'success',
      title: 'Tu reseña se ha publicado',
      showConfirmButton: false,
      timer: 1500
    })

    this.reviewForm.reset()
    this.selectedRating = 0
  }
}
