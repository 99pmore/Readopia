import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  userEmail: string | null = null

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.getUserEmail().then(email => {
      this.userEmail = email;
    })
  }
}
