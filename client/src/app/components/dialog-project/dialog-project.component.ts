import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ProjectDescriptor } from '../../services/data.service';

@Component({
  selector: 'app-dialog-project',
  templateUrl: './dialog-project.component.html',
  styleUrls: ['./dialog-project.component.css']
})
export class DialogProjectComponent implements OnInit {

  header: string = '';
  projectEmpty: ProjectDescriptor = {} as any;

  constructor( public dialogRef: MatDialogRef<DialogProjectComponent>, @Inject(MAT_DIALOG_DATA) public project: ProjectDescriptor ) {
    // Check input data if creating a project or editing one
    if(this.project.id !== undefined)
      this.header = 'Edit Project';
    else
      this.header = 'New Project';
  }

  ngOnInit() {
  }

  onOKClick() {
    // Return the edited project data
    this.dialogRef.close(this.project);
  }

  onCancelClick() {
    // Cancelled, return empty project data
    this.dialogRef.close(this.projectEmpty);
  }

  onKeyUp(event: KeyboardEvent) {
    if(event.keyCode == 13) {// Enter
      // Return the edited project data
      this.dialogRef.close(this.project);
    }
    else if(event.keyCode == 27) {// Escape
      // Cancelled, return empty project data
      this.dialogRef.close(this.projectEmpty);
    }
  }

}
