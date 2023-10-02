import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, arrayUnion, doc, getDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class BookDbService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) { }

  async addReadBook(bookId: string) {
    const user = this.auth.currentUser
    if (user) {
      const userRef = doc(this.firestore, `users/${user.uid}`)
      await updateDoc(userRef, {
        readBooks: arrayUnion(bookId)
      })

    } else {
      return alert('El usuario no está auntenticado')
    }
  }

  async getReadBooks() {
    try {
      const user = this.auth.currentUser

      if (user) {
        const userRef = doc(this.firestore, `users/${user.uid}`)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
          const userData = userDoc.data()

          if (userData && userData['readBooks']) {
            console.log(userData['readBooks'])
            return userData['readBooks']
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
