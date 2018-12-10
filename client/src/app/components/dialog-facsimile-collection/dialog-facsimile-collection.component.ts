import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FacsimileCollectionDescriptor } from '../../services/data.service';

@Component({
  selector: 'app-dialog-facsimile-collection',
  templateUrl: './dialog-facsimile-collection.component.html',
  styleUrls: ['./dialog-facsimile-collection.component.css']
})
export class DialogFacsimileCollectionComponent implements OnInit {

  header: string = '';
  dataItemEmpty: FacsimileCollectionDescriptor = {} as any;

  constructor( public dialogRef: MatDialogRef<DialogFacsimileCollectionComponent>, @Inject(MAT_DIALOG_DATA) public dataItem: FacsimileCollectionDescriptor ) {
    // Build the dialog header
    if(this.dataItem.id !== undefined)
      this.header = 'Edit ';
    else
      this.header = 'New ';
    this.header += 'Facsimile Collection';
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