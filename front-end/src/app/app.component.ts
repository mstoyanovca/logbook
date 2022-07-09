import { Component } from '@angular/core';
import { UserService } from './service/user.service';
import { User } from './model/user';

@Component({ selector: 'app-root', templateUrl: './app.component.html' })
export class AppComponent {
  title = 'front-end';
  user: User;

  constructor(private userService: UserService) {
    this.user = new User();
    this.userService.user.subscribe(u => this.user = u);
  }

  logout() {
    this.userService.logout();
  }
}
