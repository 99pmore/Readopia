import { Component, Input, OnInit } from '@angular/core';
import { faStar as faStarSol } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarReg } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  @Input() rating!: number

  faStarSol = faStarSol
  faStarReg = faStarReg

  constructor() { }

  ngOnInit(): void {
  }

}
