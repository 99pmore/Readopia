import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MyBooksComponent } from './pages/my-books/my-books.component';
import { BookInfoComponent } from './pages/book-info/book-info.component';
import { SearchComponent } from './pages/search/search.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SearchUsersComponent } from './pages/search-users/search-users.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { FollowsListComponent } from './pages/follows-list/follows-list.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'mybooks', component: MyBooksComponent},
    { path: 'books/:id', component: BookInfoComponent},
    { path: 'search', component: SearchComponent},
    { path: 'searchUsers', component: SearchUsersComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'profile/:id', component: ProfileComponent},
    { path: 'editUser', component: EditUserComponent},
    { path: 'profile/:id/followers', component: FollowsListComponent},
    { path: 'profile/:id/following', component: FollowsListComponent},
    { path: 'notFound', component: NotFoundPageComponent},
    { path: '**', pathMatch: 'full', redirectTo: 'notFound'}
];