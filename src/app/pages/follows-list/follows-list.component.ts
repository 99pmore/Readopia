import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserDB } from 'src/app/models/userDB.interface';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { FollowService } from 'src/app/services/follow.service';
import { Subscription } from 'rxjs';
import { UserCardComponent } from 'src/app/components/user-card/user-card.component';

@Component({
  selector: 'app-follows-list',
  standalone: true,
  imports: [CommonModule, RouterLink, UserCardComponent],
  templateUrl: './follows-list.component.html',
  styleUrls: ['./follows-list.component.scss']
})
export class FollowsListComponent implements OnInit, OnDestroy {

  private userId!: string
  public list!: string

  private followIds!: string[]
  public follows: UserDB[] = []

  private followingSubscription!: Subscription

  constructor (
    private route: ActivatedRoute,
    private userService: UserService,
    private followService: FollowService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.userId = this.route.snapshot.paramMap.get('id')!
    this.list = this.route.snapshot.url[2].path

    this.getUserData()

    this.followingSubscription = this.followService.updatedFollowing$
    .subscribe(() => {
      this.getUserData()
    })
  }

  ngOnDestroy(): void {
    if (this.followingSubscription) {
      this.followingSubscription.unsubscribe()
    }
  }

  private async getUserData() {
    if (this.userId) {
      const user = await this.userService.getUserById(this.userId)

      if (this.list === 'following') {
        const { following } = user
        this.followIds = following ?? []

      } else if (this.list === 'followers') {
        const { followers } = user
        this.followIds = followers ?? []
      }

      if (this.followIds) {
        this.getUserFollows()
      }
    }
  }

  private async getUserFollows() {
    try {
      const followPromises = this.followIds.map((id) => this.userService.getUserById(id))

      const followResults = await Promise.all(followPromises)

      this.follows = followResults.filter((user) => user !== null)

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error al obtener seguidores/seguidos`,
      })
    }
  }
}
