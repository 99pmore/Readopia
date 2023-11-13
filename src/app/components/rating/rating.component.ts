import { Component, Input, OnInit } from '@angular/core';
import { faStar as faStarSol, faStarHalfAlt as faStarHalf } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarReg } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-rating',
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.scss'],
    standalone: true,
    imports: [NgFor, FontAwesomeModule]
})
export class RatingComponent implements OnInit {

  @Input() rating!: number | undefined

  public faStarSol = faStarSol
  public faStarReg = faStarReg
  public faStarHalf = faStarHalf

  constructor() { }

  ngOnInit(): void {
  }

  public showHalfStar(index: number): boolean {
    if (this.rating === undefined) {
      return false
    }
  
    return this.rating > index && this.rating < index + 1
  }

  public floorRating(): number {
    if (this.rating === undefined) {
      return 0
    }
  
    return Math.floor(this.rating)
  }
}
