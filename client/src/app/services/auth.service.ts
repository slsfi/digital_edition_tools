import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthService {

  // The user object (used to store email, access token, refresh token and logged in status)
  user : User;

  // For renewing access tokens
  private timer;
  private sub: Subscription;
  private accessTokenRenewalInProgress = false;

  public accessToken: BehaviorSubject<string>;

  // Array of failed http requests (not currently used)
  cachedRequests: Array<HttpRequest<any>> = [];

  constructor(private http: HttpClient, private router: Router) { 
    // Get user data from local storage, or create empty data if no data in yet in local storage
    if(localStorage.getItem("user")) {
      this.user = JSON.parse(localStorage.getItem("user"));
    }
    else {
      this.user = {loggedIn: false, email: "", tokenRefresh: "", tokenAccess: ""};
    }
    // Create a timer to use for renewing the access token
    //this.timer = Observable.timer(1000,600000); // 10 minutes
    this.timer = Observable.timer(1000,60000);
    this.sub = this.timer.subscribe(t=> {
        this.refreshTokenTick(t);
    });
    // Create a behaviour subject so components can subscribe to the access token
    this.accessToken = new BehaviorSubject<string>("");
  }

  // GETTERS
  // ---------------------------------------------

  // Getter method to see if user is logged in
  getLoggedIn() : boolean {
    return this.user.loggedIn;
  }

  // Getter method for access token
  getAccessToken() : string {
    return this.user.tokenAccess;
  }

  // Getter method to check if access token is being renewed
  // Used by TokenInterceptor
  getAccessTokenRenewalInProgress() : boolean {
    return this.accessTokenRenewalInProgress;
  }

  // SETTERS
  // ---------------------------------------------

  // Set logged in variables and store them to local storage
  setLoggedIn(loggedIn: boolean, data: any) {
    this.user.loggedIn = loggedIn;
    if(this.user.loggedIn) {
      this.user.tokenRefresh = data.refresh_token;
      this.user.tokenAccess = data.access_token;
    }
    else {
      this.user.tokenRefresh = "";
      this.user.tokenAccess = "";
    }
    localStorage.setItem("user", JSON.stringify(this.user));
  }

  // OTHER METHODS
  // ---------------------------------------------

  // 
  login(email: string, password: string) : Observable<any> {
    this.user.email = email;
    return this.http.post<any>(environment.api_url + "/auth/login", {"email" : email, "password" : password});
  }

  logout() {
    this.user.loggedIn = false;
    this.user.tokenRefresh = "";
    this.user.tokenAccess = "";
    localStorage.setItem("user", JSON.stringify(this.user));
    this.router.navigate(['/login']);
  }

  // Test the access token to see if it is still valid.
  // This method can be subscribed to from a component etc.
  testAccessToken() : Observable<any>  {
    // Autorization header (with access token) is applied automatically by TokenInterceptor
    return this.http.post<any>(environment.api_url + "/auth/test", null);
  }

  // Renew the access token used by the JWT authentication.
  // If it fails, the user will be redirected to the login screen (if there was a response from the server).
  renewAccessToken() {
    // Set the flag that renewal is in progress so multiple requests of this kind will not be made at once
    this.accessTokenRenewalInProgress = true;
    // Clear the current access token
    this.user.tokenAccess = "";
    // Send a refresh http request with the refresh token in the header
    this.http.post<any>(environment.api_url + "/auth/refresh", null, { headers: {'Authorization':'Bearer '+this.user.tokenRefresh} }).subscribe(
      data => { 
        // Access token successfully renewed
        this.user.tokenAccess = data.access_token;
        this.accessTokenRenewalInProgress = false;
        // Update the behaviour subject for the access token
        this.accessToken.next(this.user.tokenAccess);
      },
      err => {
        // Something went wrong, go to login page if unauthorized
        this.accessTokenRenewalInProgress = false;
        // If unauthorized, go to login screen
        if(err.status == 401) {
          this.logout();
        }
        console.log(err); 
      }
    );
  }

  // The method called by the timer set up to renew access tokens.
  // It will simply call the renewAccessToken method on every tick.
  refreshTokenTick(tick){
    this.renewAccessToken();
  }

  // Used to stop (unsubscribe) the timer to renew access tokens
  // This method is not currently used, it might not be needed.
  stopRefreshTokenTimer() {
    this.sub.unsubscribe();
  }


  collectFailedRequest(request: HttpRequest<any>): void {
    this.cachedRequests.push(request);
  }

  retryFailedRequests(): void {
    // retry the requests. this method can
    // be called after the token is refreshed
  }

}

// Model for user data
export interface User {
  loggedIn : boolean,
  email : string,
  tokenRefresh: string,
  tokenAccess: string
}
