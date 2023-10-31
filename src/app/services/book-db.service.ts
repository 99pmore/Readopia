import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, arrayRemove, arrayUnion, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { BookDB } from '../models/bookDB.interface';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class BookDbService {

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
          Swal.fire({
            position: 'top-end',
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
          
          if (userData && userData[booksList]) {
            return userData[booksList]
          }
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
      console.log('Error al obtener los libros:', error)
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
        confirmButtonColor: '#9e9682',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
        
      })
      .then(async (result) => {
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

    Swal.fire(
      'Eliminado',
      'El libro se ha eliminado',
      'success'
    )
  }

  private moveBook(book: BookDB, fromList: string, toList: string) {
    this.deleteBook(book, fromList, false)
    
    book.state = this.getState(toList)
    this.addBook(book, toList)
  }

  private getListName(booksList: string): string {
    const listName = booksList === 'readingBooks'
                    ? 'Leyendo'
                    : booksList === 'readBooks'
                    ? 'Leídos'
                    : 'Quiero leer'
    return listName
  }

  private getListType(book: BookDB) {
    const nowList = book?.state === 'reading'
                  ? 'readingBooks'
                  : book?.state === 'read'
                  ? 'readBooks'
                  : 'wishBooks'
    return nowList
  }

  private getState(booksList: string) {
    const state = booksList === 'readingBooks'
                    ? 'reading'
                    : booksList === 'readBooks'
                    ? 'read'
                    : 'wish'
    return state
  }
}
