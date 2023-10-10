import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [MenuComponent]
})
export class HeaderComponent {

}
