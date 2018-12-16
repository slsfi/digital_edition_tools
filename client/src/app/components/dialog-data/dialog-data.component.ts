import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataItemType, DataItemDescriptor } from '../../services/data.service';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-dialog-data',
  templateUrl: './dialog-data.component.html',
  styleUrls: ['./dialog-data.component.css']
})
export class DialogDataComponent implements OnInit {

  header: string = '';
  genres = environment.genres;
  publishedLevels = environment.published_levels;
  showGenre: boolean = false;
  showDate: boolean = false;
  showPublished: boolean = true;
  dataItemEmpty: DataItemDescriptor = {} as any;

  constructor( public dialogRef: MatDialogRef<DialogDataComponent>, @Inject(MAT_DIALOG_DATA) public dataItem: DataItemDescriptor ) {
    // Build the dialog header
    // First check input data if creating a project or editing one
    if(this.dataItem.id !== undefined)
      this.header = 'Edit ';
    else
      this.header = 'New ';
    // Then check type of data
    switch(this.dataItem.type) {
      case DataItemType.Project:
        this.header += 'Project';
        break;
      case DataItemType.PublicationCollection:
        this.header += 'Collection';
        this.showDate = true;
        break;
      case DataItemType.Publication:
        this.header += 'Publication';
        this.showGenre = true;
        break;
      case DataItemType.Version:
        this.header += 'Version';
        break;
      case DataItemType.Manuscript:
        this.header += 'Manuscript';
        break;
    }
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
