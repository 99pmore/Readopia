import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [MenuComponent, FormsModule, ReactiveFormsModule, RouterLink]
})
export class RegisterComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private auth: Auth,
  ) { }

  registerForm!: FormGroup

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  register() {
    const name = this.registerForm.get('name')?.value
    const lastname = this.registerForm.get('lastname')?.value
    const email = this.registerForm.get('email')?.value
    const password = this.registerForm.get('password')?.value

    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user

        if (user) {
          updateProfile(user, {
            displayName: `${name} ${lastname}`,
          })
          .then(() => {
            this.userService.addUser(user)
            this.router.navigate(['/'])
          })
          .catch((error) => {
            console.log('Error añadiento datos del usuario: ', error)
          })
        }

      })
      .catch((error) => {
        console.log('Error en el registro: ', error)
      })
  }
}
