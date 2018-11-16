import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DataItemDescriptor, DataItemType, DataService } from "../../services/data.service";
//import { ListLevel } from "../grid-publications/grid-publications.component";
import { DialogGitComponent } from '../dialog-git/dialog-git.component';

@Component({
  selector: 'app-tool-publisher',
  templateUrl: './tool-publisher.component.html',
  styleUrls: ['./tool-publisher.component.css']
})
export class ToolPublisherComponent implements OnInit {

  textType: TextType = TextType.None;
  public Level: any = DataItemType;
  listLevel: DataItemType = DataItemType.Project;

  rowDataManuscripts: any = [];
  rowDataVersions: any = [];
  rowDataFacsimiles: any = [];

  constructor(private data: DataService, public dialog: MatDialog) { }

  ngOnInit() {
    this.data.changeTool("Publisher");
  }

  onListLevelChanged(level: DataItemType) {
    this.listLevel = level;
  }

  onPublicationOpened(publication: DataItemDescriptor) {
    // Get versions
    this.data.getVersions(this.data.projectName, this.data.publicationCollection, this.data.publication).subscribe(
      data => {
        let versionsData = [];
        for (var i = 0; i < data.variations.length; i++) {
          versionsData.push( {'id': data.variations[i].id, 'title': data.variations[i].name, 'filename': data.variations[i].original_filename} );
        }
        this.rowDataVersions = versionsData;
      },
      err => { console.info(err); }
    );
    // Get manuscripts
    this.data.getManuscripts(this.data.projectName, this.data.publicationCollection, this.data.publication).subscribe(
      data => {
        let manuscriptsData = [];
        for (var i = 0; i < data.manuscripts.length; i++) {
          manuscriptsData.push( {'id': data.manuscripts[i].id, 'title': data.manuscripts[i].name, 'filename': data.manuscripts[i].original_filename} );
        }
        this.rowDataManuscripts = manuscriptsData;
      },
      err => { console.info(err); }
    );
  }

  onLoadReadingTextClick() {
    this.textType = TextType.ReadingText;
    this.showGitDialog();
  }

  onLoadVersionClick() {
    this.textType = TextType.Version;
    this.showGitDialog();
  }

  onLoadManuscriptClick() {
    this.textType = TextType.Manuscript;
    this.showGitDialog();
  }

  showGitDialog() {
    const dialogRef = this.dialog.open(DialogGitComponent, {
      width: '700px',
      data: {name: "", path: ""}
    });

    dialogRef.afterClosed().subscribe(result => {
      switch(this.textType) {
        case TextType.ReadingText:
          break;
        case TextType.Version:
          break;
        case TextType.Manuscript:
          break;
      }
    });
  }

}

enum TextType {
  None,
  ReadingText,
  Version,
  Manuscript
}
