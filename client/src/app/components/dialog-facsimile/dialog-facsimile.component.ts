import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FacsimileDescriptor } from '../../services/data.service';

@Component({
  selector: 'app-dialog-facsimile',
  templateUrl: './dialog-facsimile.component.html',
  styleUrls: ['./dialog-facsimile.component.css']
})
export class DialogFacsimileComponent implements OnInit {

  header: string = '';
  dataItemEmpty: FacsimileDescriptor = {} as any;

  constructor( public dialogRef: MatDialogRef<DialogFacsimileComponent>, @Inject(MAT_DIALOG_DATA) public dataItem: FacsimileDescriptor ) {
    // Build the dialog header
    if(this.dataItem.id !== undefined)
      this.header = 'Edit ';
    else
      this.header = 'New ';
    this.header += 'Facsimile';
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
