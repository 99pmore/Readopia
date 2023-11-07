import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserDB } from 'src/app/models/userDB.interface';
import { FollowService } from 'src/app/services/follow.service';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  @Input() user!: UserDB
  
  public follows!: boolean
  public followsignal = signal<boolean>(this.follows)

  constructor (
    private followService: FollowService
    ) { }
    
    async ngOnInit(): Promise<void> {
      this.follows = await this.followService.isFollowing(this.user.id as string)
      this.followsignal.set(this.follows)
  }

  public followUser(userId: string | undefined) {
    if (userId) {
      if (this.follows) {
        this.followService.deleteFollowing(userId)
        this.follows = false
        
      } else {
        this.followService.addFollow(userId)
        this.follows = true
      }
      
      this.followsignal.set(this.follows)
    }
  }

}
