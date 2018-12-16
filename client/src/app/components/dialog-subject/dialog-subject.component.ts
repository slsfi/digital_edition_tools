import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SubjectDescriptor } from '../../services/data.service';

@Component({
  selector: 'app-dialog-subject',
  templateUrl: './dialog-subject.component.html',
  styleUrls: ['./dialog-subject.component.css']
})
export class DialogSubjectComponent implements OnInit {

  header: string = '';
  dataItemEmpty: SubjectDescriptor = {} as any;

  constructor( public dialogRef: MatDialogRef<DialogSubjectComponent>, @Inject(MAT_DIALOG_DATA) public dataItem: SubjectDescriptor ) {
    // Build the dialog header
    if(this.dataItem.id !== undefined)
      this.header = 'Edit ';
    else
      this.header = 'New ';
    this.header += 'Subject';
  }

  ngOnInit() {
  }

  onOKClick() {
    // Return the edited project data
    this.dialogRef.close(this.dataItem);
  }

  onCancelClick() {
    // Cancelled, return empty project data
    this.dialogRef.close(this.dataItemEmpty);
  }

  onKeyUp(event: KeyboardEvent) {
    if(event.keyCode == 13) {// Enter
      // Return the edited project data
      this.dialogRef.close(this.dataItem);
    }
    else if(event.keyCode == 27) {// Escape
      // Cancelled, return empty project data
      this.dialogRef.close(this.dataItemEmpty);
    }
  }

}