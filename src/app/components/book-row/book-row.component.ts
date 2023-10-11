import { Component, Input } from '@angular/core';
import { BookDB } from 'src/app/models/bookDB.interface';
import { RatingComponent } from '../rating/rating.component';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-book-row',
    templateUrl: './book-row.component.html',
    styleUrls: ['./book-row.component.scss'],
    standalone: true,
    imports: [NgFor, RatingComponent, RouterLink]
})
export class BookRowComponent {
  @Input() book!: BookDB
}
