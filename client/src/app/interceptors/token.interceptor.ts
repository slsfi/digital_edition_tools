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
import { catchError, mergeMap } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import { AuthService } from "../services/auth.service";


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
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
    request = this.addAuthHeader(request);

    return <any>next.handle(request).pipe(catchError((err) => {
      const errorResponse = err as HttpErrorResponse;
      if (errorResponse.status === 401) {
        return this.authService.refreshToken().pipe(mergeMap(() => {
          request = this.addAuthHeader(request);
          return next.handle(request);
        }));
      }
    }));
  }
}