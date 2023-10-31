import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ProfilePhotosService } from 'src/app/services/profile-photos.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, MenuComponent, FormsModule, ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  
  userLoggedIn: boolean = false
  user!: User | null

  userId!: string | undefined
  name!: string | undefined
  lastName!: string | undefined
  email!: string | undefined
  
  profilePhotos!: any[]
  selectedPhoto!: string | undefined
  photoSelectionOpen: boolean = false

  constructor(
    private fb: FormBuilder,
    private fbPwd: FormBuilder,
    private authService: AuthService,
    private profilePhotosService: ProfilePhotosService,
    private userService: UserService,
  ) { }

  editForm!: FormGroup
  pwdForm!: FormGroup

  ngOnInit(): void {
    this.getProfilePhotos()

    this.editForm = this.fb.group({
      name: ['', []],
      lastname: ['', []],
    })

    this.pwdForm = this.fbPwd.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordRep: ['', [Validators.required, Validators.minLength(8)]],
    })

    this.authService.authChanges().subscribe((user) => {
      this.user = user
      this.userLoggedIn = !!user
      this.userId = user?.uid

      if (this.userLoggedIn) {
        if (this.userId) {
          this.getUserData()
        }
      }
    })
  }

  openPhotoSelection() {
    this.photoSelectionOpen = !this.photoSelectionOpen
  }
  
  selectProfilePhoto(image: string) {
    this.selectedPhoto = image
    this.photoSelectionOpen = false
  }

  edit() {
    const name = this.editForm.get('name')?.value
    const lastname = this.editForm.get('lastname')?.value
    const photo = this.selectedPhoto || ''

    if (this.userLoggedIn && this.userId) {
      this.authService.editUser(name, lastname, photo)
    }
  }

  changePassword() {
    const password = this.pwdForm.get('password')?.value
    const passwordRep = this.pwdForm.get('passwordRep')?.value

    if (this.userLoggedIn && this.userId) {
      this.authService.changePassword(password, passwordRep)
    }
  }

  private async getUserData() {
    if (this.userId) {
      const user = await this.userService.getUserById(this.userId)

      const { name, lastname, email, photo } = user

      this.name = name
      this.lastName = lastname
      this.email = email
      this.selectedPhoto = photo
    }
  }

  private getProfilePhotos() {
    this.profilePhotosService.getPhotos().subscribe(images => {
      this.profilePhotos = images
    })
  }
}
