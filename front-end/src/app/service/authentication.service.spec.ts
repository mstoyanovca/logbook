import {TestBed} from '@angular/core/testing';
import {AuthenticationService} from './authentication.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {User} from '../model/user';
import {HttpClient} from "@angular/common/http";

describe('AuthenticationService', () => {
    let service: AuthenticationService;
    let httpMock: HttpTestingController;

    const user = new User('a@gmail.com', 'password', '');
    const requestBody = new User(user.email, user.password, 'access-token');
    const apiUrl = 'http://localhost:4200';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [HttpClient, AuthenticationService]
        });

        service = TestBed.get(AuthenticationService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(async () => {
        httpMock.verify();
        localStorage.removeItem('currentUser');
    });

    it('should be created', async () => {
        expect(service).toBeTruthy();
    });

    it('logged in should return true', async () => {
        localStorage.setItem('currentUser', JSON.stringify(requestBody));
        expect(service.currentUserValue);
    });

    it('login should return an Observable', async () => {
        service.login('a@gmail.com', 'password').subscribe(response => {
            expect(response).toBe(requestBody);
            expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(requestBody));
        });

        const req = httpMock.expectOne(apiUrl + '/login');
        expect(req.request.method).toBe('POST');
        req.flush(requestBody);
    });

    it('login should return error with wrong credentials', async () => {
        service.login('b@gmail.com', 'password').subscribe(() => {
        }, error => {
            expect(error).toBe('Incorrect username or password.');
        });

        const req = httpMock.expectOne(apiUrl + '/login');
        expect(req.request.method).toBe('POST');
        req.flush(requestBody);
    });

    it('log out should clear local storage', async () => {
        localStorage.setItem('currentUser', JSON.stringify(requestBody));
        service.logout();
        expect(localStorage.getItem('currentUser')).toBe(null);
    });
});
