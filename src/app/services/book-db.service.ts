import { Injectable, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, arrayRemove, arrayUnion, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { BookDB } from '../models/bookDB.interface';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookDbService {

  private updatedBooksSubject = new Subject<void>()
  public updatedBooks$ = this.updatedBooksSubject.asObservable()

  public hasBook = signal<boolean>(false)

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) { }

  async addBook(book: BookDB, booksList: string) {
    const allBooks = await this.getAllBooks()
    const matchingBook = allBooks.find((userBook) => userBook.id === book.id)
    
    const listName = this.getListName(booksList)
    
    if (!matchingBook) {
      const userId = this.auth.currentUser?.uid
      if (userId) {
        const userRef = doc(this.firestore, `users/${userId}`)
        await updateDoc(userRef, {
          [booksList]: arrayUnion(book)
        })
        .then(() => {
          this.hasBook.update((value: boolean) => !value)

          Swal.fire({
            toast: true,
            position: 'center-end',
            icon: 'success',
            title: `${book.title} añadido a ${listName}`,
            showConfirmButton: false,
            timer: 1500
          })
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `${error}`,
          })
        })
  
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El usuario no está autenticado',
          footer: '<a href="/login">Iniciar sesión</a>'
        })
      }
      
    } else {
      const nowList = this.getListType(matchingBook)
      
      if (booksList === nowList) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `${book.title} ya está en ${listName}`,
        })
        
      } else {
        this.moveBook(matchingBook, nowList, booksList)
      }
      
    }
  }
  
  async getUserBooks(booksList: string) {
    try {
      const userId = this.auth.currentUser?.uid
      if (userId) {
        const userRef = doc(this.firestore, `users/${userId}`)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
          const userData = userDoc.data()
          return userData?.[booksList]
        }

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El usuario no está autenticado',
          footer: '<a href="/login">Iniciar sesión</a>'
        })
      }
      
      return []
      
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error}`,
      })
      throw error
    }
  }

  async getAllBooks(): Promise<BookDB[]> {
    try {
      const readBooks = await this.getUserBooks('readBooks')
      const readingBooks = await this.getUserBooks('readingBooks')
      const wishBooks = await this.getUserBooks('wishBooks')

      readBooks.reverse()
      readingBooks.reverse()
      wishBooks.reverse()
      
      return readingBooks.concat(readBooks, wishBooks)

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${error}`,
      })
      return []
    }
  }

  async deleteBook(book: BookDB, booksList: string, requireConfirmation: boolean ) {
    const listName = this.getListName(booksList)

    if (requireConfirmation) {
      Swal.fire({
        title: '¿Estás seguro/a?',
        text: `Se eliminará ${book.title} de ${listName}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#90abc4',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
        
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.performDelete(book, booksList)
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `${error}`,
        })
      })

    } else {
      this.performDelete(book, booksList)
    }
  }

  private async performDelete(book: BookDB, booksList: string) {
    const userId = this.auth.currentUser?.uid
    if (userId) {
      const userRef = doc(this.firestore, `users/${userId}`)
      await updateDoc(userRef, {
        [booksList]: arrayRemove(book)
      })
      .then(() => {
        this.updatedBooksSubject.next()
        this.hasBook.update((value: boolean) => !value)
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `${error}`,
        })
      })

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El usuario no está autenticado',
        footer: '<a href="/login">Iniciar sesión</a>'
      })
    }

    Swal.fire({
      toast: true,
      position: 'center-end',
      icon: 'success',
      title: 'Eliminado',
      text: 'El libro se ha eliminado',
      showConfirmButton: false,
      timer: 1500,
    })
  }

  private moveBook(book: BookDB, fromList: string, toList: string) {
    this.deleteBook(book, fromList, false)
    
    book.state = this.getState(toList)
    this.addBook(book, toList)
  }

  private getListName(booksList: string): string {
    let listName: string
    if (booksList === 'readingBooks') {
      listName = 'Leyendo'
    } else if (booksList === 'readBooks') {
      listName = 'Leídos'
    } else {
      listName = 'Quiero leer'
    }
    return listName
  }
  
  private getListType(book: BookDB) {
    let nowList: string
    if (book?.state === 'reading') {
      nowList = 'readingBooks'
    } else if (book?.state === 'read') {
      nowList = 'readBooks'
    } else {
      nowList = 'wishBooks'
    }
    return nowList
  }
  
  private getState(booksList: string) {
    let state: string
    if (booksList === 'readingBooks') {
      state = 'reading'
    } else if (booksList === 'readBooks') {
      state = 'read'
    } else {
      state = 'wish'
    }
    return state
  }
}
