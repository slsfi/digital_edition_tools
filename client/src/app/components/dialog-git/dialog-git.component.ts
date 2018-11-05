import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DocumentDescriptor } from '../../services/data.service';

@Component({
  selector: 'app-dialog-git',
  templateUrl: './dialog-git.component.html',
  styleUrls: ['./dialog-git.component.css']
})
export class DialogGitComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<DialogGitComponent>, @Inject(MAT_DIALOG_DATA) public data: DocumentDescriptor) {
  }

  ngOnInit() {
  }

  onDocumentLoaded(doc: DocumentDescriptor) {
    this.dialogRef.close(doc);
  }

}
