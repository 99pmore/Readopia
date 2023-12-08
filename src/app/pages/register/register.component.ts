import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MenuComponent } from '../../components/menu/menu.component';
import { AuthService } from 'src/app/services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { CharacterPhotoSelectorComponent } from 'src/app/components/character-photo-selector/character-photo-selector.component';

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

  register() {
    const photo = this.selectedPhoto

    const name = this.registerForm.get('name')?.value
    const lastname = this.registerForm.get('lastname')?.value
    const email = this.registerForm.get('email')?.value
    const password = this.registerForm.get('password')?.value

    this.authService.register(photo, name, lastname, email, password)
  }
}
