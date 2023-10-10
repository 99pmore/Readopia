import { Component, OnInit } from '@angular/core';
import { BookDB } from 'src/app/models/bookDB.interface';
import { BookDbService } from 'src/app/services/book-db.service';
import { BookRowComponent } from '../../components/book-row/book-row.component';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
    selector: 'app-my-books',
    templateUrl: './my-books.component.html',
    styleUrls: ['./my-books.component.scss'],
    standalone: true,
    imports: [MenuComponent, FormsModule, NgIf, NgFor, BookRowComponent]
})
export class MyBooksComponent implements OnInit {

  readBooks: BookDB[] = []
  readingBooks: BookDB[] = []
  wishBooks: BookDB[] = []
  allBooks: BookDB[] = []

  public selectedOption: string = 'all'

  constructor(
    private bookDBService: BookDbService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getBooks()
  }

  async getBooks() {
    try {
      this.readBooks = await this.bookDBService.getBooks('readBooks')
      this.readingBooks = await this.bookDBService.getBooks('readingBooks')
      this.wishBooks = await this.bookDBService.getBooks('wishBooks')

      this.allBooks = await this.bookDBService.getAllBooks()

    } catch (error) {
      console.error('Error al obtener los libros leídos:', error)
    }
  }

}
