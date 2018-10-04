import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { DataService } from "../../services/data.service";
import { ERROR_COLLECTOR_TOKEN } from '@angular/platform-browser-dynamic/src/compiler_factory';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  status: string = "Please log in!";
  username: string = "";
  password: string = "";

  constructor(private router: Router, private authService: AuthService, private dataService: DataService) { }

  ngOnInit() {
    // Change active "tool"
    this.dataService.changeTool("Login");
    //window.localStorage.setItem("accessToken", "huehiuwhfeuwefhuwfehuewf");
    //window.localStorage.setItem("refreshToken", "asdhiaiuqweiuoqewu");
  }

  onKeyUp(event: KeyboardEvent): void { 
    if (event.which == 13) { // Enter pressed
      this.eventLogin();
    } 
  }

  eventLogin() {
    this.doLogin(this.username,this.password);
  }

  doLogin(username: string, password: string) {
    this.authService.login(username, password).subscribe(
      data => { 
        this.authService.setLoggedIn(true, data);
        this.status = data.refresh_token;
        this.router.navigate(['/menu']);
      },
      err => {
        this.authService.setLoggedIn(false, null);
        this.status = err.error.msg; 
      },
      () => console.log('Login successful!')
    );
  }


  /*doTest() {
    this.authService.testAccessToken().subscribe(
      data => { 
        this.status = data.msg; 
      },
      err => {
        this.status = err.error.msg; 
      },
      () => console.log('Login successful!')
    );
  }*/

  /*eventRenew() {
    this.authService.renewAccessToken();
  }*/

}
