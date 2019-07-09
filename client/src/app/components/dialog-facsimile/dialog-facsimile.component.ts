import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService, FacsimileDescriptor, DataItemType } from '../../services/data.service';

@Component({
  selector: 'app-dialog-facsimile',
  templateUrl: './dialog-facsimile.component.html',
  styleUrls: ['./dialog-facsimile.component.css']
})
export class DialogFacsimileComponent implements OnInit {

  facsimileType = DataItemType;
  header: string = '';
  dataItemEmpty: FacsimileDescriptor = {} as any;
  versions: any;
  manuscripts: any;

  constructor( private data: DataService, public dialogRef: MatDialogRef<DialogFacsimileComponent>, @Inject(MAT_DIALOG_DATA) public dataItem: FacsimileDescriptor ) {
    // Build the dialog header
    if(this.dataItem.id !== undefined)
      this.header = 'Edit ';
    else
      this.header = 'New ';
    this.header += 'Facsimile Link';
  }

  ngOnInit() {
    // Get versions
    this.data.getVersions(this.data.projectName, this.data.publicationCollection, this.data.publication).subscribe(
      data => {
        this.versions = data.variations;
      },
      err => { console.log(err); }
    );
    // Get manuscripts
    this.data.getManuscripts(this.data.projectName, this.data.publicationCollection, this.data.publication).subscribe(
      data => {
        this.manuscripts = data.manuscripts;
      },
      err => { console.log(err); }
    );
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
