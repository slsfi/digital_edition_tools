import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData, LocationDescriptor } from '../../services/data.service';

@Component({
  selector: 'app-dialog-location',
  templateUrl: './dialog-location.component.html',
  styleUrls: ['./dialog-location.component.css']
})
export class DialogLocationComponent implements OnInit {

  header = '';
  dataItemEmpty: LocationDescriptor = {} as any;
  dialogData: DialogData = {success: false, data: this.dataItemEmpty};

  constructor( public dialogRef: MatDialogRef<DialogLocationComponent>, @Inject(MAT_DIALOG_DATA) public dataItem: LocationDescriptor ) {
    // Build the dialog header
    if (this.dataItem.id !== undefined) {
      this.header = 'Edit ';
    } else {
      this.header = 'New ';
    }
    this.header += 'Location';
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
