import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, mergeMap, switchMap, finalize, filter, take } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import { AuthService } from "../services/auth.service";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  
  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  
  constructor(public authService: AuthService) {}

  getAuthHeader() : string {
    if(this.authService.getAccessToken().length > 0)
      return `Bearer ${this.authService.getAccessToken()}`;
    else
      return null;
  }

  addAuthHeader(request) {
    const authHeader = this.getAuthHeader();
    if (authHeader) {
      return request.clone({
        setHeaders: {
          Authorization: authHeader
        }
      });
    }
    return request;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
    return <any>next.handle(this.addAuthHeader(request))
      .pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            switch ((<HttpErrorResponse>err).status) {
              case 401:
                return this.handle401Error(request, next);
              //case 400:
              //  return <any>this.authService.logout();
            }
          } else {
            //return throwError(err);
          }
        }));
    /*return <any>next.handle(request).pipe(catchError((err) => {
      const errorResponse = err as HttpErrorResponse;
      if (errorResponse.status === 401) {
        return this.authService.refreshToken().pipe(mergeMap(() => {
          request = this.addAuthHeader(request);
          return next.handle(request);
        }));
      }
    }));*/
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
 
    if(!this.isRefreshingToken) {
      this.isRefreshingToken = true;
 
      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);
 
      return this.authService.refreshToken()
        .pipe(
          switchMap((token: string) => {
            if(token.length > 0) {
              this.tokenSubject.next(token);
              return next.handle(this.addAuthHeader(request));
            }
            return <any>this.authService.logout();
          }),
          catchError(err => {
            return <any>this.authService.logout();
          }),
          finalize(() => {
            this.isRefreshingToken = false;
          })
        );
    } else {
      this.isRefreshingToken = false;
 
      return this.tokenSubject
        .pipe(filter(token => token != null),
          take(1),
          switchMap(token => {
          return next.handle(this.addAuthHeader(request));
        }));
    }
  }
}