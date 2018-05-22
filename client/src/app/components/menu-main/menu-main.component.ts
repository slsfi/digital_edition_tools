import { Component, OnInit } from '@angular/core';
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-menu-main',
  templateUrl: './menu-main.component.html',
  styleUrls: ['./menu-main.component.css']
})
export class MenuMainComponent implements OnInit {

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.changeTool("Menu");
  }

}
