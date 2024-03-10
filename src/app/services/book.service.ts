import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private readonly URL = 'https://www.googleapis.com/books/v1/volumes'
  private readonly API_KEY = environment.firebase.apiKey

  constructor(
    private httpClient: HttpClient
  ) { }

  public getBooks(query: string): Observable<Book[]> {
    const params = new HttpParams().set('q', query).set('key', this.API_KEY).set('maxResults', 10);
    return this.httpClient.get<Book[]>(this.URL, { params })
  }
  
  public getBook(id: string): Observable<Book> {
    return this.httpClient.get<Book>(`${this.URL}/${id}`)
  }
}
