import { VolumeInfo } from './../../models/book.interface';
import { Component, Input } from '@angular/core';
import { Book } from 'src/app/models/book.interface';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookDB } from 'src/app/models/bookDB.interface';

@Component({
    selector: 'app-book-card',
    templateUrl: './book-card.component.html',
    styleUrls: ['./book-card.component.scss'],
    standalone: true,
    imports: [RouterLink, NgFor, NgIf]
})
export class BookCardComponent {

  @Input() book!: Book | BookDB

  public isBookDB(book: any): book is BookDB {
    return (book as BookDB).cover !== undefined
  }

  public getDisplayedAuthors(book: Book): string[] {
    return book.volumeInfo?.authors?.slice(0, 3) || []
  }
}
