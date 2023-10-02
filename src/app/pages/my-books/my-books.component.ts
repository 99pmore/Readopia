import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book.interface';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.scss']
})
export class MyBooksComponent implements OnInit {

  public selectedOption: string = 'all'
  
  // public allBooks: Book[] = this.readingBooks.concat(this.readBooks, this.wishBooks)

  constructor() { }

  ngOnInit(): void {
  }

}
