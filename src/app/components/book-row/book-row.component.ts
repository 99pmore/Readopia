import { Component, Input } from '@angular/core';
import { BookDB } from 'src/app/models/bookDB.interface';

@Component({
  selector: 'app-book-row',
  templateUrl: './book-row.component.html',
  styleUrls: ['./book-row.component.scss']
})
export class BookRowComponent {
  @Input() book!: BookDB
}
