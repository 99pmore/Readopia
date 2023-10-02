import { BookService } from 'src/app/services/book.service';
import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  books!: Book[]
  search!: string

  constructor(
    private bookService: BookService
  ) { }

  ngOnInit(): void {
  }

  searchBooks() {
    const query = this.search

    if (query) {
      this.bookService.getBooks(query).subscribe((data: any) => {
        this.books = data.items
      })
    }
  }

}