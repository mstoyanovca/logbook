import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  constructor(private httpClient: HttpClient) {
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('ACCESS_TOKEN') !== null;
  }

  login(username: string, password: string): Observable<any> {
    return this.httpClient.post<any>('/user/authenticate', {username, password})
      .pipe(map(response => {
        if (response && response.token && response.expiresIn) {
          localStorage.setItem('ACCESS_TOKEN', response.token);
          localStorage.setItem('EXPIRES_IN', response.expiresIn);
        }

        return response;
      }));
  }

  logout() {
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('EXPIRES_IN');
    localStorage.removeItem('users');
  }
}
