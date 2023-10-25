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
  
  isFollowing!: boolean

  constructor (
    private userService: UserService,
  ) { }

  async ngOnInit(): Promise<void> {
    if (this.user.id) this.isFollowing = await this.userService.isFollowing(this.user.id)
  }

  followUser(userId: string | undefined) {
    if (this.isFollowing) {
      this.userService.deleteFollowing(userId as string)

    } else {
      this.userService.addFollow(userId as string)
    }
  }

}
