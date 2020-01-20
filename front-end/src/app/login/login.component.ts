import {Component} from '@angular/core';
import {User} from '../model/user';
import {AuthenticationService} from '../service/authentication.service';
import {first} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';

@Component({selector: 'app-login', templateUrl: './login.component.html', styleUrls: ['./login.component.css']})
export class LoginComponent {
    user = new User('', '');
    authenticationError = '';
    loggedIn: boolean;

    forgotPasswordEmail: string;
    forgotPasswordError: string;

    oldPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
    changePasswordError: string;

    constructor(private authenticationService: AuthenticationService, private logger: NGXLogger) {
        if (this.authenticationService.currentUserValue) this.loggedIn = true;
    }

    login() {
        if (this.loggedIn) return;
        this.logger.log('Logging in with an email ' + this.user.email);

        this.authenticationService.login(this.user.email, this.user.password)
            .pipe(first())
            .subscribe(_ => {
                    this.loggedIn = true;
                    this.authenticationError = '';
                    this.logger.log('Logged in');
                },
                error => {
                    this.logger.log('Error logging in: ' + JSON.stringify(error));
                    this.authenticationError = 'Incorrect email and password';
                });
    }

    forgotPassword() {
        this.logger.log(`Password reset requested for email: ${this.forgotPasswordEmail}`);

        this.authenticationService.forgotPassword(this.forgotPasswordEmail)
            .subscribe(result => {
                    if (result === "Success") {
                        this.logger.log('Sent password reset link');
                        document.getElementById('closeForgotPasswordModal').click();
                    }
                }, error => {
                    this.logger.log(`Password reset request failed: ${error}`);
                    this.forgotPasswordError = 'Password reset request failed';
                }
            );
    }

    changePassword() {
        this.logger.log('Password change requested');

        this.authenticationService.changePassword(this.newPassword)
            .subscribe(result => {
                    if (result === "Success") {
                        this.logger.log('Password changed successfully');
                        document.getElementById('closeChangePasswordModal').click();
                        this.logout();
                    }
                }, error => {
                    this.logger.log(`Password change failed: ${error}`);
                    this.changePasswordError = 'Password change failed';
                }
            );
    }

    logout() {
        this.authenticationService.logout();
        this.loggedIn = false;
        this.logger.log('Logged out');
    }

    resetForgotPasswordError() {
        this.forgotPasswordError = '';
    }

    resetChangePasswordError() {
        this.changePasswordError = '';
    }
}
