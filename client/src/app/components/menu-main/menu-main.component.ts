import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-menu-main',
  templateUrl: './menu-main.component.html',
  styleUrls: ['./menu-main.component.css']
})
export class MenuMainComponent implements OnInit {

  constructor(private auth: AuthService, private data: DataService) { }

  ngOnInit() {
    this.data.changeTool("Menu");
  }

  onLogoutClick() {
    this.auth.logout();
  }

}
