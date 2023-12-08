import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { CharacterPhotoSelectorComponent } from 'src/app/components/character-photo-selector/character-photo-selector.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, MenuComponent, FormsModule, ReactiveFormsModule, NgFor, NgIf, CharacterPhotoSelectorComponent],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  
  private userLoggedIn: boolean = false
  private userId!: string | undefined
  
  public selectedPhoto: string | undefined

  constructor(
    private fb: FormBuilder,
    private fbPwd: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
  ) { }

  public editForm!: FormGroup
  public pwdForm!: FormGroup

  ngOnInit(): void {
    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
    })

    this.pwdForm = this.fbPwd.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordRep: ['', [Validators.required, Validators.minLength(8)]],
    })

    this.authService.authChanges().subscribe((user) => {
      this.userLoggedIn = !!user
      this.userId = user?.uid

      if (this.userLoggedIn) {
        if (this.userId) {
          this.getUserData()
        }
      }
    })
  }

  public receiveDataFromChild(photo: string) {
    this.selectedPhoto = photo
  }

  public edit() {
    if (this.editForm.valid) {
      const name = this.editForm.get('name')?.value
      const lastname = this.editForm.get('lastname')?.value
      const photo = this.selectedPhoto || ''
  
      if (this.userLoggedIn && this.userId) {
        this.authService.editUser(name, lastname, photo)
      }

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El formulario no es válido',
      })
    }
  }

  public changePassword() {
    if (this.pwdForm.valid) {
      const password = this.pwdForm.get('password')?.value
      const passwordRep = this.pwdForm.get('passwordRep')?.value
  
      if (this.userLoggedIn && this.userId) {
        this.authService.changePassword(password, passwordRep)
      }

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El formulario no es válido',
      })
    }
  }

  public validEdit(info: string) {
    return this.editForm.get(info)?.invalid && (this.editForm.get(info)?.dirty || this.editForm.get(info)?.touched)
  }

  public validPassword(info: string) {
    return this.pwdForm.get(info)?.invalid && (this.pwdForm.get(info)?.dirty || this.pwdForm.get(info)?.touched)
  }

  public errorMessage(info: string) {
    let error: string = ''

    if (info === 'name') {
      if (this.editForm.get(info)?.errors?.['required']) {
        error = 'Introduce tu nombre'
      }

    } else if (info === 'lastname') {
      if (this.editForm.get(info)?.errors?.['required']) {
        error = 'Introduce tus apellidos'
      }

    } else if (info === 'password') {
      if (this.pwdForm.get(info)?.errors?.['required']) {
        error = 'Introduce una contraseña'
      }
      else if (this.pwdForm.get(info)?.errors?.['minlength']) {
        error = 'La contraseña debe tener al menos 8 caracteres'
      }

    } else if (info === 'passwordRep') {
      if (this.pwdForm.get(info)?.errors?.['required']) {
        error = 'Repite la contraseña'
      }
      else if (this.pwdForm.get(info)?.errors?.['minlength']) {
        error = 'La contraseña debe tener al menos 8 caracteres'
      }

    }

    return error
  }

  private async getUserData() {
    if (this.userId) {
      const user = await this.userService.getUserById(this.userId)

      const { name, lastname, photo } = user

      this.editForm.patchValue({
        name: name,
        lastname: lastname
      })

      this.selectedPhoto = photo
    }
  }
}
