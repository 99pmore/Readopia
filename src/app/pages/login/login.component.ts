import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [MenuComponent, FormsModule, ReactiveFormsModule, RouterLink]
})
export class LoginComponent implements OnInit {

  email!: string
  password!: string

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: Auth
  ) { }

  loginForm!: FormGroup

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  login() {
    const email = this.loginForm.get('email')?.value
    const password = this.loginForm.get('password')?.value

    signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        this.router.navigate(['/'])
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
