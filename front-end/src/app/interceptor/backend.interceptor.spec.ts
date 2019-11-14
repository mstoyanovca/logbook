import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {User} from '../model/user';
import {AuthenticationService} from '../service/authentication.service';
import {BackendInterceptor} from './backend.interceptor';

describe('BackendInterceptor', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;
  let backendInterceptor: BackendInterceptor;

  const user = new User(1, 'a@gmail.com', 'password');
  const requestBody = {
    id: user.id,
    username: user.email,
    token: 'access-token',
    expiresIn: 900
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BackendInterceptor]
    });

    service = TestBed.get(AuthenticationService);
    httpMock = TestBed.get(HttpTestingController);
    backendInterceptor = TestBed.get(BackendInterceptor);

    localStorage.setItem('users', JSON.stringify(user));
  });

  afterEach(() => {
    httpMock.verify();

    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('EXPIRES_IN');
    localStorage.removeItem('users');
  });

  it('should be created', () => {
    expect(backendInterceptor).toBeTruthy();
  });

  it('intercept should return an Observable', () => {
    service.login('a@gmail.com', 'password').subscribe(response => {
      expect(response).toBe(requestBody);

      req.flush(requestBody);
    });

    const req = httpMock.expectOne('/user/authenticate');
    expect(req.request.method).toBe('POST');
  });

  it('intercept should return error with wrong credentials', () => {
    service.login('b@gmail.com', 'password').subscribe(() => {
    }, error => {
      expect(error).toBe('Incorrect username or password.');
    });

    const req = httpMock.expectOne('/user/authenticate');
    expect(req.request.method).toBe('POST');
  });
});
