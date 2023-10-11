import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MenuComponent } from '../../components/menu/menu.component';
import { AuthService } from 'src/app/services/auth.service';

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
    private authService: AuthService
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

    this.authService.login(email, password)
  }
}
