import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookDB } from 'src/app/models/bookDB.interface';
import { BookDbService } from 'src/app/services/book-db.service';
import { BookRowComponent } from '../../components/book-row/book-row.component';
import { LoginLinkComponent } from 'src/app/components/login-link/login-link.component';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../../components/menu/menu.component';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-my-books',
    templateUrl: './my-books.component.html',
    styleUrls: ['./my-books.component.scss'],
    standalone: true,
    imports: [MenuComponent, FormsModule, NgIf, NgFor, BookRowComponent, LoginLinkComponent]
})
export class MyBooksComponent implements OnInit, OnDestroy {

  public userLoggedIn: boolean = false
  
  public readBooks: BookDB[] = []
  public readingBooks: BookDB[] = []
  public wishBooks: BookDB[] = []
  public allBooks: BookDB[] = []

  public selectedOption: string = 'all'

  private booksSubscription!: Subscription

  constructor(
    private bookDBService: BookDbService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.authService.authChanges().subscribe((user) => {
      this.userLoggedIn = !!user

      if (this.userLoggedIn) {
        this.getUserBooks()

        this.booksSubscription = this.bookDBService.updatedBooks$
        .subscribe(() => {
          this.getUserBooks()
        })
      }

      this.route.queryParams.subscribe((queryParams) => {
        this.selectedOption = queryParams['option'] || 'all';
      })
    })
  }

  ngOnDestroy(): void {
    if (this.booksSubscription) {
      this.booksSubscription.unsubscribe()
    }
  }

  private async getUserBooks() {
    try {
      this.readBooks = await this.bookDBService.getUserBooks('readBooks')
      this.readingBooks = await this.bookDBService.getUserBooks('readingBooks')
      this.wishBooks = await this.bookDBService.getUserBooks('wishBooks')

      this.allBooks = await this.bookDBService.getAllBooks()

      this.readBooks.reverse()
      this.readingBooks.reverse()
      this.wishBooks.reverse()

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error}`,
      })
    }
  }

}
