import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { LoginLinkComponent } from 'src/app/components/login-link/login-link.component';
import { SmCoverComponent } from 'src/app/components/sm-cover/sm-cover.component';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '@angular/fire/auth';
import { BookDB } from 'src/app/models/bookDB.interface';
import { UserDB } from 'src/app/models/userDB.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReviewsService } from 'src/app/services/reviews.service';
import { Review } from 'src/app/models/review.interface';
import { RatingComponent } from 'src/app/components/rating/rating.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MenuComponent, LoginLinkComponent, SmCoverComponent, RatingComponent, RouterLink, FontAwesomeModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userLoggedIn: boolean = false
  user!: User | null
  id!: string | undefined

  userId!: string | undefined
  fullName!: string | undefined
  email!: string | undefined
  photo!: string | undefined
  
  followingIds!: string[]
  followersIds!: string[]

  following: UserDB[] = []
  followers: UserDB[] = []

  readBooks: BookDB[] = []
  readingBooks: BookDB[] = []
  wishBooks: BookDB[] = []

  reviews: Review[] = []

  faEdit = faEdit
  
  constructor (
    private userService: UserService,
    private authService: AuthService,
    private reviewsService: ReviewsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService.authChanges().subscribe((user) => {
      this.user = user
      this.userLoggedIn = !!user
      this.id = user?.uid

      if (this.userLoggedIn) {
        this.route.paramMap.subscribe((paramMap) => {
          const userId = paramMap.get('id')

          if (userId) {
            this.userId = userId
            this.getUserData()
            this.getUserReviews()
          }
        })
      }
    })
  }

  private async getUserData() {
    if (this.userId) {
      const user = await this.userService.getUserById(this.userId)

      const { name, lastname, email, photo, following, followers, readBooks, readingBooks, wishBooks } = user

      this.fullName = `${name} ${lastname}`
      this.email = email
      this.photo = photo
      this.followingIds = following || []
      this.followersIds = followers || []

      if (this.followingIds && this.followersIds) {
        this.getUserFollows()
      }

      this.readBooks = readBooks?.reverse() || []
      this.readingBooks = readingBooks?.reverse() || []
      this.wishBooks = wishBooks?.reverse() || []
    }
  }

  private async getUserFollows() {
    try {
      const followingPromises = this.followingIds.map((id) => this.userService.getUserById(id))
      const followerPromises = this.followersIds.map((id) => this.userService.getUserById(id))

      const followingResults = await Promise.all(followingPromises)
      const followerResults = await Promise.all(followerPromises)

      this.following = followingResults.filter((user) => user !== null)
      this.followers = followerResults.filter((user) => user !== null)

    } catch (error) {
      console.error('Error al obtener seguidores/seguidos: ', error)
    }
  }

  private async getUserReviews() {
    if (this.userId) this.reviews = await this.reviewsService.getUserReviews(this.userId)
  }

}
