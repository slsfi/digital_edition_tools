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
  projectName: string;
  tool: string;

  constructor(
    private data: DataService,
    @Inject(APP_CONFIG) private config: AppConfig
  ) { 
    this.projectName = this.data.projectName;
  }

  ngOnInit() {
    this.version = this.config.version;
    this.data.currentToolObservable.subscribe(tool => { this.tool = tool });
    this.data.projectNameObservable.subscribe(project => { this.projectName = project.charAt(0).toUpperCase() + project.substr(1); });
  }

}
