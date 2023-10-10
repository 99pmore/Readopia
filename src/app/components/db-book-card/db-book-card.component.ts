import { BookDB } from 'src/app/models/bookDB.interface';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-db-book-card',
    templateUrl: './db-book-card.component.html',
    styleUrls: ['./db-book-card.component.scss'],
    standalone: true,
    imports: [RouterLink]
})
export class DbBookCardComponent {

  @Input() book!: BookDB
}
