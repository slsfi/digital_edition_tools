import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DataItemDescriptor, DataItemType, DataService } from "../../services/data.service";
//import { ListLevel } from "../grid-publications/grid-publications.component";
import { DialogGitComponent } from '../dialog-git/dialog-git.component';
import { GridFacsimilesComponent } from '../grid-facsimiles/grid-facsimiles.component';
import { GridTextsComponent } from '../grid-texts/grid-texts.component';

@Component({
  selector: 'app-tool-publisher',
  templateUrl: './tool-publisher.component.html',
  styleUrls: ['./tool-publisher.component.css']
})
export class ToolPublisherComponent implements OnInit {

  textType: TextType = TextType.None;
  public Level: any = DataItemType;
  listLevel: DataItemType = DataItemType.Project;
  showPublicationGUI: boolean = false;
  showPublicationCollectionGUI: boolean = false;
  readingText: string = '';
  titleText: string = '';
  introductionText: string = '';

  rowDataManuscripts: any = [];
  rowDataVersions: any = [];
  rowDataFacsimiles: any = [];

  @ViewChildren(GridTextsComponent) 
  gridsTexts: QueryList<GridTextsComponent>;

  @ViewChild(GridFacsimilesComponent) 
  private facsimilesComponent: GridFacsimilesComponent;

  constructor(private data: DataService, public dialog: MatDialog) { }

  ngOnInit() {
    this.data.changeTool("Publisher");
  }

  onListLevelChanged(level: DataItemType) {
    this.listLevel = level;
    // Hide the publication GUI if not showing publications
    if(this.listLevel == DataItemType.Publication)
      this.showPublicationGUI = true;
    else
      this.showPublicationGUI = false;
    // Hide the publication collection GUI if not showing publication collections
    if(this.listLevel == DataItemType.PublicationCollection)
      this.showPublicationCollectionGUI = true;
    else
      this.showPublicationCollectionGUI = false;
  }

  onPublicationCollectionOpened(publication: DataItemDescriptor) {
    // TODO: Get title and introduction texts
    this.titleText = 'Title';
    this.introductionText = 'Intro';
  }

  onPublicationOpened(publication: DataItemDescriptor) {
    // Show the publication GUI
    //this.showPublicationGUI = true;
    // TODO: Get reading text original
    this.readingText = 'Jaha';
    // Show the loading overlay of the text grids
    this.gridsTexts.forEach((child) => { child.showLoadingOverlay(); });
    // Get versions
    this.data.getVersions(this.data.projectName, this.data.publicationCollection, publication.id).subscribe(
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
    this.data.getManuscripts(this.data.projectName, this.data.publicationCollection, publication.id).subscribe(
      data => {
        let manuscriptsData = [];
        for (var i = 0; i < data.manuscripts.length; i++) {
          manuscriptsData.push( {'id': data.manuscripts[i].id, 'title': data.manuscripts[i].name, 'filename': data.manuscripts[i].original_filename} );
        }
        this.rowDataManuscripts = manuscriptsData;
      },
      err => { console.info(err); }
    );
    // Get facsimiles (handled in the child component)
    this.facsimilesComponent.getFacsimiles();
  }

  onLoadTitleClick() {
    this.textType = TextType.Title;
    this.showGitDialog();
  }

  onLoadIntroductionClick() {
    this.textType = TextType.Introduction;
    this.showGitDialog();
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
      if(result.name.length > 0) {
        switch(this.textType) {
          case TextType.Title:
            this.titleText = result.path + '/' + result.name;
            break;
          case TextType.Introduction:
            this.introductionText = result.path + '/' + result.name;
            break;
          case TextType.ReadingText:
            this.readingText = result.path + '/' + result.name;
            break;
          case TextType.Version:
            break;
          case TextType.Manuscript:
            break;
        }
      }
    });
  }

}

enum TextType {
  None,
  Title,
  Introduction,
  ReadingText,
  Version,
  Manuscript
}
