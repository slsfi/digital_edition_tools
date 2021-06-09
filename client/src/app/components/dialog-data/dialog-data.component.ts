import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataItemType, DataItemDescriptor, DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-dialog-data',
  templateUrl: './dialog-data.component.html',
  styleUrls: ['./dialog-data.component.css']
})
export class DialogDataComponent implements OnInit {

  header: string = '';
  genres = environment.genres;
  tags: Array<Object> = [];
  publishedLevels = environment.published_levels;
  showGenre: boolean = false;
  showDate: boolean = false;
  showPublished: boolean = true;
  showFacsimimilePage: boolean = false;
  dataItemEmpty: DataItemDescriptor = {} as any;

  constructor( private data: DataService, public dialogRef: MatDialogRef<DialogDataComponent>, @Inject(MAT_DIALOG_DATA) public dataItem: DataItemDescriptor ) {

    // get all tags
    if( this.dataItem.type === DataItemType.Tag && this.dataItem.id === undefined) {
      this.data.getProjectTags(this.data.projectName).subscribe(
        data => {
           this.tags = data;
           this.tags.forEach((tag, index, tags)=>{
            if (tag['project_id'] !== this.data.projectId) {
               // remove tags for other projects
               tags.splice(index, 1);
            }
           });
        },
        err => { console.log(err); }
      );
    }


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
      case DataItemType.Tag:
        this.header += 'Term';
        this.showPublished = false;
        this.showFacsimimilePage = true;
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
