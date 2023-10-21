import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MyBooksComponent } from './pages/my-books/my-books.component';
import { BookInfoComponent } from './pages/book-info/book-info.component';
import { SearchComponent } from './pages/search/search.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'mybooks', component: MyBooksComponent},
    { path: 'books/:id', component: BookInfoComponent},
    { path: 'search', component: SearchComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'profile', component: ProfileComponent},
    // { path: 'error-404', component: Error404Component},
    { path: '**', pathMatch: 'full', redirectTo: 'error-404'}
];