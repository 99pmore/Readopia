import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
// import { Firestore, addDoc, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    // private db: AngularFirestore,
    // private auth: AngularFireAuth,
    private router: Router,
    // private auth: Auth = inject(Auth),
    // private db: Firestore = inject(Firestore),
  ) { }

  registerForm!: FormGroup

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  register() {
    // const email = this.registerForm.get('email')?.value
    // const password = this.registerForm.get('password')?.value

    // try {
    //   createUserWithEmailAndPassword(this.auth, email, password)
    //   .then((userCredential) => {
    //     const user = userCredential.user
    //     if (user) {
    //       const usersCollection = collection(this.db, 'users')
    //       addDoc(usersCollection, {
    //         uid: user.uid,
    //         email: email,
    //       })
    //     }
    //     this.router.navigate(['/'])
    //   })

    // } catch (error) {
    //   console.error('Error durante el registro:', error)
    // }
  }
}
