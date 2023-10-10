import { Component, Input } from '@angular/core';
import { BookDB } from 'src/app/models/bookDB.interface';
import { RatingComponent } from '../rating/rating.component';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-book-row',
    templateUrl: './book-row.component.html',
    styleUrls: ['./book-row.component.scss'],
    standalone: true,
    imports: [NgFor, RatingComponent]
})
export class BookRowComponent {
  @Input() book!: BookDB
}
