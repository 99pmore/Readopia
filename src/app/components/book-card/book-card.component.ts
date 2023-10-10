import { Component, Input } from '@angular/core';
import { Book } from 'src/app/models/book.interface';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-book-card',
    templateUrl: './book-card.component.html',
    styleUrls: ['./book-card.component.scss'],
    standalone: true,
    imports: [RouterLink, NgFor]
})
export class BookCardComponent {
  @Input() book!: Book
}
