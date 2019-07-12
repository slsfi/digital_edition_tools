import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DataService, DataItemDescriptor, DataItemType } from '../../services/data.service';
import { ReadModelAsStringFloatingFilterComp } from 'ag-grid/dist/lib/filter/floatingFilter';

@Component({
  selector: 'app-menu-main',
  templateUrl: './menu-main.component.html',
  styleUrls: ['./menu-main.component.css']
})
export class MenuMainComponent implements OnInit {

  currentProjectName: string;
  currentProjectId: number;
  projects: DataItemDescriptor[];

  constructor(private auth: AuthService, private data: DataService) {
    this.currentProjectName = this.data.projectName;
    this.currentProjectId = this.data.projectId;
  }

  ngOnInit() {
    this.data.changeTool('Menu');
    this.data.getProjects().subscribe(
      data => {
        const tmpData = [];
        for ( let i = 0; i < data.length; i++ ) {
          tmpData.push({type: DataItemType.Project, 'title': data[i].name, 'id': data[i].id});
        }
        this.projects = tmpData;
      },
      err => { }
    );
  }

  selectProject(event: any) {
    this.projects.forEach(project => {
      if ( project.id === event.value ) {
        this.currentProjectId = event.value;
        this.currentProjectName = project.title;
        this.data.setProject(this.currentProjectName, this.currentProjectId);
      }
    });
  }

  onLogoutClick() {
    this.auth.logout();
  }

}
