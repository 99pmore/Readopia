import { Component, Input } from '@angular/core';
import { Book } from 'src/app/models/book.interface';

@Component({
  selector: 'app-book-row',
  templateUrl: './book-row.component.html',
  styleUrls: ['./book-row.component.scss']
})
export class BookRowComponent {
  @Input() book!: Book
}
