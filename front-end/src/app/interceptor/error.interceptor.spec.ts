import {TestBed} from '@angular/core/testing';
import {ErrorInterceptor} from './error.interceptor';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AuthenticationService} from '../service/authentication.service';
import {User} from '../model/user';

describe('ErrorInterceptor', () => {
    let errorInterceptor: ErrorInterceptor;
    let service: AuthenticationService;
    const user = new User('a@gmail.com', 'password');

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ErrorInterceptor]
        });

        errorInterceptor = TestBed.get(ErrorInterceptor);
        service = TestBed.get(AuthenticationService);

        localStorage.setItem('user', JSON.stringify(user));
    });

    afterEach(() => {
        localStorage.removeItem('user');
    });

    it('should be created', () => {
        expect(errorInterceptor).toBeTruthy();
    });

    it('intercept should return an Observable with an error message', () => {
        service.login('a@gmail.com', 'password').subscribe(response => {
            expect(response).toBe(user);
        });
    });
});
