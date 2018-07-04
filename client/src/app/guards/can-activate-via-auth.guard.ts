import { Injectable } from '@angular/core';
//import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from "@angular/router";
import { AuthService } from '../services/auth.service';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService ) {}

  canActivate() {
    if(this.authService.getLoggedIn()) {
      return true;
    }
    else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  /*canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }*/
}
