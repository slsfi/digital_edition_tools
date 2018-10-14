import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DocumentDescriptor, DataService } from "../../services/data.service";
import { DialogGitComponent } from '../dialog-git/dialog-git.component';

@Component({
  selector: 'app-tool-publisher',
  templateUrl: './tool-publisher.component.html',
  styleUrls: ['./tool-publisher.component.css']
})
export class ToolPublisherComponent implements OnInit {

  constructor(private data: DataService, public dialog: MatDialog) { }

  ngOnInit() {
    this.data.changeTool("Publisher");
  }

  onLoadClick() {
    const dialogRef = this.dialog.open(DialogGitComponent, {
      width: '700px',
      data: {name: "", path: ""}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if(result !== undefined) 
        alert(result.path + "/" + result.name);
    });
  }

}
