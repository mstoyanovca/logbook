import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService } from '../service/user.service';
import { User } from '../model/user';

@Component({ selector: 'app-login', templateUrl: './login.component.html' })
export class LoginComponent implements OnInit {
  // loginForm: FormGroup;
  submitted = false;
  loading = false;
  user: User;

  // constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private userService: UserService) {
  constructor() {
    this.user = new User();
    this.user.email = "mstoyanovca@gmail.com";
    this.user.password = "password";
  }

  ngOnInit() {
   /*  this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    }); */
  }

  // get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    /* if (this.form.invalid) {
      return;
    }
    this.loading = true;

    this.userService.login(this.f.email.value, this.f.password.value).pipe(first()).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: error => {
        console.error(error)
        this.loading = false;
      }
    }); */
  }
}
