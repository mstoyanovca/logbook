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

    resetPasswordEmail: string;

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

    resetPassword() {
        this.logger.log('Password reset requested for email: ' + this.resetPasswordEmail);
        document.getElementById('closeForgotPasswordModal').click();
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

    resetChangePasswordError() {
        this.changePasswordError = '';
    }
}
