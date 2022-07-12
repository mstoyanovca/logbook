import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import {NgForm} from '@angular/forms';
import { UserService } from '../../service/user.service';
import { User } from '../../model/user';

@Component({ templateUrl: './register.component.html' })
export class RegisterComponent {
  user: User;
  loading = false;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService) {
      this.user = new User();
    }

  onSubmit(registerForm: NgForm) {
    this.submitted = true;
    this.loading = true;

    this.userService.register(registerForm.value)
    .pipe(first())
    .subscribe({
      next: () => {
        this.router.navigate(['/login'], { relativeTo: this.route });
      },
      error: error => {
        this.loading = false;
      }
    });
  }
}
