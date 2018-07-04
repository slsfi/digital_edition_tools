import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { AuthService } from "../services/auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
    let authHeader = "";
    // Add access token if it exists
    if(this.authService.getAccessToken().length > 0)
      authHeader = `Bearer ${this.authService.getAccessToken()}`;
    // ... otherwise add refresh token if it exists
    //else if(this.authService.getRefreshToken().length > 0)
    //  authHeader = `Bearer ${this.authService.getRefreshToken()}`;
    
    if(authHeader.length > 0) {
      request = request.clone({
        setHeaders: {
          Authorization: authHeader
        }
      });
    }
    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // do stuff with response if you want
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          // Renew access token if renewal is not already in progress
          if(!this.authService.getAccessTokenRenewalInProgress()) {
          //this.authService.collectFailedRequest(request);
            this.authService.renewAccessToken();
          }
        }
      }
    });
  }
}