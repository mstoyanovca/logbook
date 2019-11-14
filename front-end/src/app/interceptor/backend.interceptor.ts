import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {delay, dematerialize, materialize, mergeMap} from 'rxjs/operators';
import {User} from '../model/user';

@Injectable()
export class BackendInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const users: User[] = JSON.parse(localStorage.getItem('users')) || [];

    return of(null).pipe(mergeMap(() => {
      // login:
      if (request.url.endsWith('/user/authenticate') && request.method === 'POST') {
        const filteredUsers = users.filter(user => {
          return user.email === request.body.username && user.password === request.body.password;
        });

        if (filteredUsers.length) {
          const user = filteredUsers[0];
          const requestBody = {
            id: user.id,
            username: user.email,
            token: 'access-token',
            expiresIn: 900
          };

          return of(new HttpResponse({status: 200, body: requestBody}));
        } else {
          return throwError({error: {message: 'Incorrect username or password.'}});
        }
      }

      return next.handle(request);
    }))
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());
  }
}
