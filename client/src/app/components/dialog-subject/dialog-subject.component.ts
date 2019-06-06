import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData, SubjectDescriptor } from '../../services/data.service';

@Component({
  selector: 'app-dialog-subject',
  templateUrl: './dialog-subject.component.html',
  styleUrls: ['./dialog-subject.component.css']
})
export class DialogSubjectComponent implements OnInit {

  header: string = '';
  dataItemEmpty: SubjectDescriptor = {} as any;
  dialogData: DialogData = {success: false, data: this.dataItemEmpty};

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
    this.dialogData.success = true;
    this.dialogData.data = this.dataItem;
    // Return the edited project data
    this.dialogRef.close(this.dialogData);
  }

  onCancelClick() {
    this.dialogData.data = this.dataItemEmpty;
    // Cancelled, return empty project data
    this.dialogRef.close(this.dialogData);
  }

  onKeyUp(event: KeyboardEvent) {
    if(event.keyCode == 13) {// Enter
      // Return the edited project data
      this.dialogData.success = true;
      this.dialogData.data = this.dataItem;
      this.dialogRef.close(this.dialogData);
    }
    else if(event.keyCode == 27) {// Escape
      // Cancelled, return empty project data
      this.dialogData.data = this.dataItemEmpty;
      this.dialogRef.close(this.dialogData);
    }
  }

}