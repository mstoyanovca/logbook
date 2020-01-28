import {inject, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {JwtInterceptor} from './jwt.interceptor';
import {AuthenticationService} from '../service/authentication.service';
import {User} from '../model/user';

describe('JwtInterceptor', () => {
    let service: AuthenticationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {
                    provide: JwtInterceptor,
                    multi: true
                },
            ]
        });

        service = TestBed.get(AuthenticationService);
    });

    it('should be created', inject([JwtInterceptor], (jwtInterceptor: JwtInterceptor) => {
        expect(jwtInterceptor).toBeTruthy();
    }));

    it('should add an Authorization header', () => {
        localStorage.setItem('user', JSON.stringify([new User('a@gmail.com', 'password')]));

        service.login('a@gmail.com', 'password').subscribe(response => {
            expect(response).toBeTruthy();
            expect(response.token);

            localStorage.removeItem('user');
        });
    });
});
