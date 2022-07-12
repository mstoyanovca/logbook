import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { User } from '../model/user';

const userKey = 'logbook';
const token = localStorage.getItem(userKey);
var users: User[];
if (token !== null ) {
  users = JSON.parse(token);
} else {
  users = [];
}

@Injectable({ providedIn: 'root' })
export class BackendService implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;
    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('/user/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/user/refresh-token') && method === 'POST':
          return refreshToken();
        case url.endsWith('/user/revoke-token') && method === 'POST':
          return revokeToken();
        case url.endsWith('/user/register') && method === 'POST':
          return register();
        case url.endsWith('/user/verify-email') && method === 'POST':
          return verifyEmail();
        case url.endsWith('/user/forgot-password') && method === 'POST':
          return forgotPassword();
        case url.endsWith('/user/validate-reset-token') && method === 'POST':
          return validateResetToken();
        case url.endsWith('/user/reset-password') && method === 'POST':
          return resetPassword();
        case url.endsWith('/user') && method === 'GET':
          return findAll();
        case url.match(/\/user\/\d+$/) && method === 'GET':
          return findById();
        case url.endsWith('/user') && method === 'POST':
          return createUser();
        case url.match(/\/user\/\d+$/) && method === 'PUT':
          return updateUser();
        case url.match(/\/user\/\d+$/) && method === 'DELETE':
          return deleteUser();
        default:
          return next.handle(request);
      }

      function authenticate() {
        const { email, password } = body;
        let user = users.find(u => u.email === email && u.password === password && u.isVerified);

        if (!user) return error('Invalid email or password');

        user.refreshTokens.push(generateRefreshToken());
        localStorage.setItem(userKey, JSON.stringify(user));

        return ok({ ...basicDetails(user), jwtToken: generateJwtToken(user) });
      }

      function refreshToken() {
        const refreshToken = getRefreshToken();

        if (!refreshToken) return unauthorized();

        const user = users.find(x => x.refreshTokens.includes(refreshToken));

        if (!user) return unauthorized();

        user.refreshTokens = user.refreshTokens.filter(x => x !== refreshToken);
        user.refreshTokens.push(generateRefreshToken());
        localStorage.setItem(userKey, JSON.stringify(user));

        return ok({ ...basicDetails(user), jwtToken: generateJwtToken(user) });
      }

      function revokeToken() {
        if (!isAuthenticated()) return unauthorized();

        const refreshToken = getRefreshToken();
        const user = users.find(u => u.refreshTokens.includes(refreshToken));
        if (user) {
          user.refreshTokens = user.refreshTokens.filter(rt => rt !== refreshToken);
          localStorage.setItem(userKey, JSON.stringify(users));
        }

        return ok();
      }

      function register() {
        const user = body;

        if (users.find(x => x.email === user.email)) {
          /* setTimeout(() => {
            alertService.info(`
              <h4>Email Already Registered</h4>
              <p>Your email ${user.email} is already registered.</p>
              <p>If you don't know your password please visit the <a href="${location.origin}/user/forgot-password">forgot password</a> page.</p>
              <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an api. A real backend would send a real email.</div>
              `, { autoClose: false });
          }, 1000); */

          return ok();
        }

        user.id = newUserId();
        user.verificationToken = new Date().getTime().toString();
        user.isVerified = false;
        user.refreshTokens = [];
        delete user.confirmPassword;
        users.push(user);
        localStorage.setItem(userKey, JSON.stringify(users));

        /* setTimeout(() => {
          const verifyUrl = `${location.origin}/user/verify-email?token=${user.verificationToken}`;
          alertService.info(`
            <h4>Verification Email</h4>
            <p>Thanks for registering!</p>
            <p>Please click the below link to verify your email address:</p>
            <p><a href="${verifyUrl}">${verifyUrl}</a></p>
            <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an api. A real backend would send a real email.</div>
            `, { autoClose: false });
        }, 1000); */

        return ok();
      }

      function verifyEmail() {
        const { token } = body;
        const user = users.find(u => !!u.verificationToken && u.verificationToken === token);

        if (!user) return error('Verification failed');

        user.isVerified = true;
        localStorage.setItem(userKey, JSON.stringify(user));

        return ok();
      }

      function forgotPassword() {
        const { email } = body;
        const user = users.find(u => u.email === email);
        if (!user) return ok();

        user.resetToken = new Date().getTime().toString();
        user.resetTokenExpiration = new Date(Date.now() + 15*60*1000).toISOString();
        localStorage.setItem(userKey, JSON.stringify(users));

        /* setTimeout(() => {
          const resetUrl = `${location.origin}/user/reset-password?token=${user.resetToken}`;
          alertService.info(`
            <h4>Reset Password Email</h4>
            <p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an api. A real backend would send a real email.</div>
            `, { autoClose: false });
          }, 1000); */

          return ok();
        }

        function validateResetToken() {
          const { token } = body;
          const user = users.find(u => u.resetToken && u.resetToken === token && u.resetTokenExpiration && new Date() < new Date(u.resetTokenExpiration));
          if (!user) return error('Invalid token');
          return ok();
        }

        function resetPassword() {
          const { token, password } = body;
          const user = users.find(u => !!u.resetToken && u.resetToken === token && u.resetTokenExpiration && new Date() < new Date(u.resetTokenExpiration));
          if (!user) return error('Invalid token');

          user.password = password;
          user.isVerified = true;
          delete user.resetToken;
          delete user.resetTokenExpiration;
          localStorage.setItem(userKey, JSON.stringify(user));

          return ok();
        }

        function findAll() {
          if (!isAuthenticated()) return unauthorized();
          return ok(users.map(u => basicDetails(u)));
        }

        function findById() {
          if (!isAuthenticated()) return unauthorized();

          let user = users.find(u => parseInt(u.id) === idFromUrl());

          const cu: User = currentUser()
          if (user && cu && user.id !== cu.id) {
            return unauthorized();
          }

          return ok(basicDetails(user!));
        }

        function createUser() {
          const user = body;
          if (users.find(u => u.email === user.email)) {
            return error(`Email ${user.email} is already registered`);
          }

          user.id = newUserId();
          user.dateCreated = new Date().toISOString();
          user.isVerified = true;
          user.refreshTokens = [];
          delete user.confirmPassword;
          users.push(user);
          localStorage.setItem(userKey, JSON.stringify(users));

          return ok();
        }

        function updateUser() {
          if (!isAuthenticated()) return unauthorized();

          let params = body;
          let user = users.find(u => parseInt(u.id) === idFromUrl());

          // user accounts can update own profile and admin accounts can update all profiles
          if (user && currentUser() && user.id !== currentUser().id) {
            return unauthorized();
          }

          // only update password if included
          if (!params.password) {
            delete params.password;
          }
          // don't save confirm password
          delete params.confirmPassword;

          // update and save user
          if(user) {
            Object.assign(user, params);
            localStorage.setItem(userKey, JSON.stringify(user));
          }

          return ok(basicDetails(user!));
        }

        function deleteUser() {
          if (!isAuthenticated()) return unauthorized();

          let user = users.find(x => parseInt(x.id) === idFromUrl());
          if (user && user.id !== currentUser().id) {
            return unauthorized();
          }

          users = users.filter(u => parseInt(u.id) !== idFromUrl());
          localStorage.setItem(userKey, JSON.stringify(users));

          return ok();
        }

        function ok(body?: any) {
          return of(new HttpResponse({ status: 200, body })).pipe(delay(500)); // delay observable to simulate server api call
        }

        function error(message: string) {
          // call materialize and dematerialize to ensure delay even if an error is thrown:
          return throwError({ error: { message } }).pipe(materialize(), delay(500), dematerialize());
        }

        function unauthorized() {
          return throwError({ status: 401, error: { message: 'Unauthorized' }}).pipe(materialize(), delay(500), dematerialize());
        }

        function basicDetails(user: User) {
          const { id, email, isVerified } = user;
          return { id, email, isVerified };
        }

        function isAuthenticated() {
          return !!currentUser();
        }

        function idFromUrl(): number {
          const urlParts = url.split('/');
          return parseInt(urlParts[urlParts.length - 1]);
        }

        function newUserId() {
          return users.length ? Math.max(...users.map(u => +u.id)) + 1 : 1;
        }

        function currentUser(): User {
          const authHeader = headers.get('Authorization');
          if (!authHeader || !authHeader.startsWith('Bearer fake-jwt-token')) return new User();

          const jwtToken = JSON.parse(atob(authHeader.split('.')[1]));
          const tokenExpired = Date.now() > (jwtToken.exp * 1000);
          if (tokenExpired) return new User();

          const user = users.find(u => u.id === jwtToken.id);
          if (user) {
            return user;
          } else {
            return new User();
          }
        }

        function generateJwtToken(user: User) {
          // create token that expires in 15 minutes
          const tokenPayload = {
            exp: Math.round(new Date(Date.now() + 15*60*1000).getTime() / 1000),
            id: user.id
          }
          return `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`;
        }

        function generateRefreshToken() {
          const token = new Date().getTime().toString();

          // add token cookie that expires in 7 days
          const expires = new Date(Date.now() + 7*24*60*60*1000).toUTCString();
          document.cookie = `fakeRefreshToken=${token}; expires=${expires}; path=/`;

          return token;
        }

        function getRefreshToken() {
          return (document.cookie.split(';').find(x => x.includes('fakeRefreshToken')) || '=').split('=')[1];
        }
      }
  }
}

export let backendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: BackendService,
  multi: true
};
