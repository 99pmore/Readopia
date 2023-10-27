import { ProfilePhotosService } from './../../services/profile-photos.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MenuComponent } from '../../components/menu/menu.component';
import { AuthService } from 'src/app/services/auth.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [MenuComponent, FormsModule, ReactiveFormsModule, RouterLink, NgFor, NgIf]
})
export class RegisterComponent implements OnInit {

  profilePhotos!: any[]
  selectedPhoto!: string
  photoSelectionOpen: boolean = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private profilePhotosService: ProfilePhotosService
  ) { }

  registerForm!: FormGroup

  ngOnInit(): void {
    this.getProfilePhotos()

    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  openPhotoSelection() {
    this.photoSelectionOpen = !this.photoSelectionOpen
  }
  
  selectProfilePhoto(image: string) {
    this.selectedPhoto = image
    this.photoSelectionOpen = false
  }

  register() {
    const photo = this.selectedPhoto

    const name = this.registerForm.get('name')?.value
    const lastname = this.registerForm.get('lastname')?.value
    const email = this.registerForm.get('email')?.value
    const password = this.registerForm.get('password')?.value

    this.authService.register(photo, name, lastname, email, password)
  }

  private getProfilePhotos() {
    this.profilePhotosService.getPhotos().subscribe(images => {
      this.profilePhotos = images
    })
  }
}
