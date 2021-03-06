import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { UserService } from '../../service/user.service';
import { User } from '../../model/user';

@Component({ templateUrl: './login.component.html' })
export class LoginComponent {
  loading = false;
  user = new User();

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) { }

  onSubmit(loginForm: NgForm) {
    const user: User = loginForm.value;
    if (loginForm.invalid) {
      return;
    }
    this.loading = true;

    this.userService.login(this.user.email, this.user.password).pipe(first()).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: error => {
        console.error(error)
        this.loading = false;
      }
    });
  }
}
