import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../service/authentication.service';
import {environment} from "../../environments/environment";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("JwtInterceptor1");
        const currentUser = this.authenticationService.currentUserValue;
        const isLoggedIn = currentUser !== null && currentUser.token !== null;
        console.log("isLoggedIn = " + isLoggedIn);
        console.log("request.url = " + request.url);
        const isProtectedUrl = request.url.includes(environment.protectedUrl);
        console.log("isProtectedUrl = " + isProtectedUrl);
        if (isLoggedIn && isProtectedUrl) {
            console.log("JwtInterceptor2");
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + currentUser.token
                }
            });
        }

        return next.handle(request);
    }
}
