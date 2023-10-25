import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDB } from 'src/app/models/userDB.interface';
import { UserService } from 'src/app/services/user.service';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { FormsModule } from '@angular/forms';
import { UserCardComponent } from 'src/app/components/user-card/user-card.component';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-search-users',
  standalone: true,
  imports: [CommonModule, MenuComponent, FormsModule, UserCardComponent],
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.scss']
})
export class SearchUsersComponent implements OnInit {

  user!: User | null
  
  users!: UserDB[]
  search!: string

  constructor (
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.authChanges().subscribe((userAuth) => {
      this.user = userAuth

      this.userService.getUsers().then((data: UserDB[]) => {
        this.users = data.filter(user => user.id !== this.user?.uid)
      })
      
    })
  }

  searchUsers() {
    this.userService.getUsers().then((data: UserDB[]) => {
      this.users = data.filter(user => user.name?.toLowerCase().includes(this.search.toLowerCase()))
    })
  }

}
