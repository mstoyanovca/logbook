import {Component} from '@angular/core';
import {User} from "./model/user";
import {AuthenticationService} from "./service/authentication.service";

@Component({selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.css']})
export class AppComponent {
    currentUser: User;

    constructor(private authenticationService: AuthenticationService) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }
}
