import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';

  constructor(
    private fb: FormBuilder,
    // private auth: AngularFireAuth,
    private router: Router,
    // private auth: Auth = inject(Auth)
  ) { }

  loginForm!: FormGroup

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  login() {
    // const email = this.loginForm.get('email')?.value
    // const password = this.loginForm.get('password')?.value

    // signInWithEmailAndPassword(this.auth, email, password)
    //   .then(() => {
    //     this.router.navigate(['/'])
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   });
  }
}
