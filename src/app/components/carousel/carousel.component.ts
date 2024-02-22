import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookCardComponent } from '../book-card/book-card.component';
import { BookDB } from 'src/app/models/bookDB.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, BookCardComponent, FontAwesomeModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {

  @Input() books!: BookDB[]
  @Input() carouselId!: string
  
  public scrollPosition: number = 0
  private scrollStep: number = 750
  
  public faChevronLeft = faChevronLeft
  public faChevronRight = faChevronRight

  public scrollLeft() {
    const container = document.getElementById(this.carouselId)
    if (container) {
      this.scrollPosition -= this.scrollStep
      this.scrollPosition = Math.max(this.scrollPosition, 0)
      container.scrollTo({
        left: this.scrollPosition,
        behavior: 'smooth'
      })
    }
  }

  public scrollRight() {
    const container = document.getElementById(this.carouselId)
    if (container) {
      this.scrollPosition += this.scrollStep
      this.scrollPosition = Math.min(this.scrollPosition, container.scrollWidth - container.clientWidth)
      container.scrollTo({
        left: this.scrollPosition,
        behavior: 'smooth'
      })
    }
  }
}
