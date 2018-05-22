import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-file-dialog',
  templateUrl: './file-dialog.component.html',
  styleUrls: ['./file-dialog.component.css']
})
export class FileDialogComponent {
  constructor(public dialogRef: MatDialogRef<FileDialogComponent>) {}
}
