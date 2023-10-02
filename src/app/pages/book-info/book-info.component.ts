import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/models/book.interface';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-book-info',
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.scss']
})
export class BookInfoComponent implements OnInit {

  book!: Book
  id!: string

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) { 
    this.book = {
      volumeInfo: {}
    }
  }

  ngOnInit(): void {
    this.getBook()
  }

  private getBook() {
    this.id = this.route.snapshot.paramMap.get('id')!

    this.bookService.getBook(this.id).subscribe((data: any) => {
      this.book = data
    })
  }

}
