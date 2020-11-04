import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData, WorkDescriptor } from '../../services/data.service';

@Component({
  selector: 'app-dialog-work',
  templateUrl: './dialog-work.component.html',
  styleUrls: ['./dialog-work.component.css']
})
export class DialogWorkComponent implements OnInit {

  header = '';
  dataItemEmpty: WorkDescriptor = {} as any;
  dialogData: DialogData = {success: false, data: this.dataItemEmpty};

  constructor( public dialogRef: MatDialogRef<DialogWorkComponent>, @Inject(MAT_DIALOG_DATA) public dataItem: WorkDescriptor ) {
    // Build the dialog header
    if (this.dataItem.id !== undefined) {
      this.header = 'Edit ';
    } else {
      this.header = 'New ';
    }
    this.header += 'Work';
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
    if (event.keyCode === 13) {// Enter
      // Return the edited project data
      this.dialogData.success = true;
      this.dialogData.data = this.dataItem;
      this.dialogRef.close(this.dialogData);
    } else if (event.keyCode === 27) {// Escape
      // Cancelled, return empty project data
      this.dialogData.data = this.dataItemEmpty;
      this.dialogRef.close(this.dialogData);
    }

  }

}
