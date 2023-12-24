import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MenuComponent } from '../../components/menu/menu.component';
import { AuthService } from 'src/app/services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { CharacterPhotoSelectorComponent } from 'src/app/components/character-photo-selector/character-photo-selector.component';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [MenuComponent, FormsModule, ReactiveFormsModule, RouterLink, NgFor, NgIf, CharacterPhotoSelectorComponent]
})
export class RegisterComponent implements OnInit {

  public selectedPhoto!: string

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) { }

  public registerForm!: FormGroup

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  public receiveDataFromChild(photo: string) {
    this.selectedPhoto = photo
  }

  public register() {
    if (this.registerForm.valid) {
      const photo = this.selectedPhoto

      const name = this.registerForm.get('name')?.value
      const lastname = this.registerForm.get('lastname')?.value
      const email = this.registerForm.get('email')?.value
      const password = this.registerForm.get('password')?.value
  
      this.authService.register(photo, name, lastname, email, password)

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El formulario no es válido',
      })
    }
  }

  public validRegister(info: string) {
    return this.registerForm.get(info)?.invalid && (this.registerForm.get(info)?.dirty || this.registerForm.get(info)?.touched)
  }

  public errorMessage(info: string) {
    let error: string = ''

    if (info === 'name') {
      if (this.registerForm.get(info)?.errors?.['required']) {
        error = 'Introduce tu nombre'
      }

    } else if (info === 'lastname') {
      if (this.registerForm.get(info)?.errors?.['required']) {
        error = 'Introduce tus apellidos'
      }

    } else if (info === 'email') {
      if (this.registerForm.get(info)?.errors?.['required']) {
        error = 'Introduce tu correo electrónico'
      }
      else if (this.registerForm.get(info)?.errors?.['email']) {
        error = 'El formato no es válido'
      }
    
    } else if (info === 'password') {
      if (this.registerForm.get(info)?.errors?.['required']) {
        error = 'Introduce una contraseña'
      }
      else if (this.registerForm.get(info)?.errors?.['minlength']) {
        error = 'La contraseña debe tener al menos 8 caracteres'
      }
    }

    return error
  }
}
