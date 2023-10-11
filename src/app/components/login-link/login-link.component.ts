import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-link',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './login-link.component.html',
  styleUrls: ['./login-link.component.scss']
})
export class LoginLinkComponent {

}
