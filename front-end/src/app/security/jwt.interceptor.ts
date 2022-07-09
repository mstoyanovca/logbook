import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../service/user.service';

const apiUrl = "http://localhost:4200"

@Injectable({ providedIn: 'root' })
export class JwtInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.userService.userValue;
    const isLoggedIn = user && user.jwtToken;
    const isApiUrl = request.url.startsWith(apiUrl);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({ setHeaders: { Authorization: `Bearer ${user.jwtToken}` }});
    }
    return next.handle(request);
  }
}
