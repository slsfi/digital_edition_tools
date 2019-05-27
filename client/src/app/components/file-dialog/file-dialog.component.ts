import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DocumentDescriptor } from '../../services/data.service';

@Component({
  selector: 'app-file-dialog',
  templateUrl: './file-dialog.component.html',
  styleUrls: ['./file-dialog.component.css']
})
export class FileDialogComponent implements OnInit  {

  documentEmpty: DocumentDescriptor = {name: "", path: ""};
  documentSelected: DocumentDescriptor;

  constructor( public dialogRef: MatDialogRef<FileDialogComponent>, @Inject(MAT_DIALOG_DATA) public header: string ) {
  }

  ngOnInit() {
  }

  onDocumentOpened(event: any) {
    this.documentSelected = event;
    this.dialogRef.close(this.documentSelected);
  }

  onOKClick() {
    // Return the selected document
    this.dialogRef.close(this.documentSelected);
  }

  onCancelClick() {
    // Cancelled, return empty document
    this.dialogRef.close(this.documentEmpty);
  }

  onKeyUp(event: KeyboardEvent) {
    if(event.keyCode == 13) {// Enter
      // Return the selected document
      this.dialogRef.close(this.documentSelected);
    }
    else if(event.keyCode == 27) {// Escape
      // Cancelled, return empty project data
      this.dialogRef.close(this.documentEmpty);
    }
  }
}
