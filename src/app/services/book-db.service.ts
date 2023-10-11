import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, arrayRemove, arrayUnion, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { BookDB } from '../models/bookDB.interface';

@Injectable({
  providedIn: 'root'
})
export class BookDbService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) { }

  async addBook(book: BookDB, booksList: string) {
    const userId = this.auth.currentUser?.uid
    
    if (userId) {
      const userRef = doc(this.firestore, `users/${userId}`)
      await updateDoc(userRef, {
        [booksList]: arrayUnion(book)
      })

    } else {
      return alert('El usuario no está auntenticado')
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
      console.log('Error al obtener todos los libros del usuario:', error)
      return []
    }
  }

  async deleteBook(book: BookDB, booksList: string) {
    const userId = this.auth.currentUser?.uid
    
    if (userId) {
      const userRef = doc(this.firestore, `users/${userId}`)
      await updateDoc(userRef, {
        [booksList]: arrayRemove(book)
      })

    } else {
      return alert('El usuario no está auntenticado')
    }
  }
}
