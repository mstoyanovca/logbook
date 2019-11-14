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
    localStorage.setItem('users', JSON.stringify([new User(1, 'a@gmail.com', 'password')]));

    service.login('b@gmail.com', 'password').subscribe(response => {
      expect(response).toBeTruthy();
      expect(response.headers.has('Authorization')).toEqual(true);

      localStorage.removeItem('users');
    });
  });
});
