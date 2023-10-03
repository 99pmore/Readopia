import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, arrayUnion, doc, getDoc, updateDoc } from '@angular/fire/firestore';
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
    const user = this.auth.currentUser
    if (user) {
      const userRef = doc(this.firestore, `users/${user.uid}`)
      await updateDoc(userRef, {
        [booksList]: arrayUnion(book)
      })

    } else {
      return alert('El usuario no está auntenticado')
    }
  }

  async getBooks(booksList: string) {
    try {
      const user = this.auth.currentUser

      if (user) {
        const userRef = doc(this.firestore, `users/${user.uid}`)
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
      console.error('(getReadBooks()): Error al obtener los libros leídos:', error)
      throw error
    }
  }
}
