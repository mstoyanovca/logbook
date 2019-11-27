import {TestBed} from '@angular/core/testing';
import {AuthenticationService} from './authentication.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {User} from '../model/user';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;

  const user = new User(1, 'a@gmail.com', 'password', '');
  const requestBody = {
    id: user.id,
    username: user.email,
    token: 'access-token',
    expiresIn: 900
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.get(AuthenticationService);
    httpMock = TestBed.get(HttpTestingController);

    localStorage.setItem('users', JSON.stringify(user));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('logged in should return true', () => {
    localStorage.setItem('ACCESS_TOKEN', 'test');

    // expect(service.isLoggedIn()).toBe(true);

    localStorage.removeItem('ACCESS_TOKEN');
  });

  it('login should return an Observable', () => {
    service.login('a@gmail.com', 'password').subscribe(response => {
      expect(response).toBe(requestBody);

      expect(localStorage.getItem('ACCESS_TOKEN')).toBe('test');
      expect(localStorage.getItem('EXPIRES_IN')).toBe('900');

      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.removeItem('EXPIRES_IN');
      localStorage.removeItem('users');

      req.flush(requestBody);
    });

    const req = httpMock.expectOne('/user/login');
    expect(req.request.method).toBe('POST');
  });

  it('login should return error with wrong credentials', () => {
    service.login('b@gmail.com', 'password').subscribe(() => {
    }, error => {
      expect(error).toBe('Incorrect username or password.');
    });

    const req = httpMock.expectOne('/user/login');
    expect(req.request.method).toBe('POST');
  });

  it('log out should clear local storage', () => {
    localStorage.setItem('ACCESS_TOKEN', 'test');
    localStorage.setItem('EXPIRES_IN', '900');

    service.logout();

    expect(localStorage.getItem('ACCESS_TOKEN')).toBe(null);
    expect(localStorage.getItem('EXPIRES_IN')).toBe(null);
    expect(localStorage.getItem('users')).toBe(null);
  });
});
