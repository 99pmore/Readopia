import { Component, OnInit } from '@angular/core';
import { BookDB } from 'src/app/models/bookDB.interface';
import { BookDbService } from 'src/app/services/book-db.service';
import { BookRowComponent } from '../../components/book-row/book-row.component';
import { LoginLinkComponent } from 'src/app/components/login-link/login-link.component';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../../components/menu/menu.component';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '@angular/fire/auth';

@Component({
    selector: 'app-my-books',
    templateUrl: './my-books.component.html',
    styleUrls: ['./my-books.component.scss'],
    standalone: true,
    imports: [MenuComponent, FormsModule, NgIf, NgFor, BookRowComponent, LoginLinkComponent]
})
export class MyBooksComponent implements OnInit {

  userLoggedIn: boolean = false
  user!: User | null
  
  readBooks: BookDB[] = []
  readingBooks: BookDB[] = []
  wishBooks: BookDB[] = []
  allBooks: BookDB[] = []

  public selectedOption: string = 'all'

  constructor(
    private bookDBService: BookDbService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.authChanges().subscribe((user) => {
      this.user = user
      this.userLoggedIn = !!user

      if (this.userLoggedIn) {
        this.getUserBooks()
      }
    })
  }

  async getUserBooks() {
    try {
      this.readBooks = await this.bookDBService.getUserBooks('readBooks')
      this.readingBooks = await this.bookDBService.getUserBooks('readingBooks')
      this.wishBooks = await this.bookDBService.getUserBooks('wishBooks')

      this.allBooks = await this.bookDBService.getAllBooks()

    } catch (error) {
      console.error('Error al obtener los libros leídos:', error)
    }
  }

}
