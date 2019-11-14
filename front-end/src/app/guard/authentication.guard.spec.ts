import {inject, TestBed} from '@angular/core/testing';
import {AuthenticationGuard} from './authentication.guard';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthenticationService} from '../service/authentication.service';
import {Router} from '@angular/router';
import any = jasmine.any;

describe('AuthenticationGuard', () => {
  let router: Router;

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

  it('should activate when logged in', () => {
    localStorage.setItem('ACCESS_TOKEN', 'test');

    const response = TestBed.get(AuthenticationGuard).canActivate(any, any);
    expect(response).toBeTruthy();

    localStorage.removeItem('ACCESS_TOKEN');
  });

  it('should not activate when not logged in', () => {
    const response = TestBed.get(AuthenticationGuard).canActivate(null, {url: '/log-book'});
    expect(response).toBeFalsy();
  });

  it('should navigate to login if not logged in', () => {
    router.navigate(['/log-book']).then(() => {
      // @ts-ignore
      expect(location.path()).toBe('/login');
    });
  });
});
