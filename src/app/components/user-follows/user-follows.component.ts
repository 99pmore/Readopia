import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDB } from 'src/app/models/userDB.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-follows',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-follows.component.html',
  styleUrls: ['./user-follows.component.scss']
})
export class UserFollowsComponent {

  @Input() following: UserDB[] = []
  @Input() followers: UserDB[] = []

}
