import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MenuComponent } from '../../components/menu/menu.component';
import { AuthService } from 'src/app/services/auth.service';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [MenuComponent, FormsModule, ReactiveFormsModule, RouterLink, NgIf]
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
      password: ['', [Validators.required]],
    })
  }

  public login() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value
      const password = this.loginForm.get('password')?.value
  
      this.authService.login(email, password)

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El formulario no es válido',
      })
    }
  }

  public validLogin(info: string) {
    return this.loginForm.get(info)?.invalid && (this.loginForm.get(info)?.dirty || this.loginForm.get(info)?.touched)
  }

  public errorMessage(info: string) {
    let error: string = ''

    if (info === 'email') {
      if (this.loginForm.get(info)?.errors?.['required']) {
        error = 'Introduce tu correo electrónico'
      }
      else if (this.loginForm.get(info)?.errors?.['email']) {
        error = 'El formato no es válido'
      }
    
    } else if (info === 'password') {
      if (this.loginForm.get(info)?.errors?.['required']) {
        error = 'Introduce una contraseña'
      }
    }

    return error
  }
}
