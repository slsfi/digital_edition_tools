import { Component, Inject, OnInit } from '@angular/core';
import { DataService } from "../../services/data.service";
//import { environment } from '../../../environments/environment';
import { APP_CONFIG, AppConfig } from '../../modules/app-config.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  version: string;
  tool: string;

  constructor(
    private data: DataService,
    @Inject(APP_CONFIG) private config: AppConfig
  ) { }

  ngOnInit() {
    this.version = this.config.version;
    this.data.currentTool.subscribe(tool => this.tool = tool)
  }

}
