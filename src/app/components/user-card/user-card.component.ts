import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserDB } from 'src/app/models/userDB.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  @Input() user!: UserDB
  
  public follows = this.userService.follows

  constructor (
    private userService: UserService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.follows()
  }

  public followUser(userId: string | undefined) {
    if (userId) {
      if (this.follows()) {
        this.userService.deleteFollowing(userId)
  
      } else {
        this.userService.addFollow(userId)
      }
    }
  }

}
