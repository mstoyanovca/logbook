import {inject, TestBed} from '@angular/core/testing';
import {AuthenticationGuard} from './authentication.guard';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthenticationService} from '../service/authentication.service';
import {Router} from '@angular/router';
import {User} from "../model/user";
import any = jasmine.any;

describe('AuthenticationGuard', () => {
    let router: Router;
    const user = new User('a@gmail.com', 'password', 'access-token');

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [AuthenticationGuard, AuthenticationService]
        });

        router = TestBed.get(Router);
        router.initialNavigation();
    });

    it('should be created', inject([AuthenticationGuard], (guard: AuthenticationGuard) => {
        expect(guard).toBeTruthy();
    }));

    it('should activate when logged in', async () => {
        localStorage.setItem('currentUser', JSON.stringify(user));

        const response = TestBed.get(AuthenticationGuard).canActivate(any, any);
        expect(response).toBeTruthy();

        localStorage.removeItem('currentUser');
    });

    it('should not activate when not logged in', async () => {
        const response = TestBed.get(AuthenticationGuard).canActivate(null, {url: '/qso'});
        expect(response).toBeFalsy();
    });

    it('should navigate to login if not logged in', async () => {
        router.navigate(['/qso']).then(() => {
            // @ts-ignore
            expect(location.path()).toBe('/login');
        });
    });
});
