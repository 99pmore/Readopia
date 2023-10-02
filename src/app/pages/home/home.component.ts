import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isUserLoggedIn = false
  userEmail: string | null = null
  
  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isUserLoggedIn = this.authService.isLoggedIn()

    this.authService.getUserEmail().then(email => {
      this.userEmail = email;
    })
  }

}
