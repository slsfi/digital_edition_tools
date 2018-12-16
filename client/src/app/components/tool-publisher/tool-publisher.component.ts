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

  stringNA = '[N/A]';
  textType: TextType = TextType.None;
  public dataItemTypes: any = DataItemType;
  listLevel: DataItemType = DataItemType.Project;
  showPublicationGUI: boolean = false;
  showPublicationCollectionGUI: boolean = false;
  readingText: string = this.stringNA;
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
    // Clear the header
    this.data.changeHeader('');
    // Set current level
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

  onPublicationCollectionOpened(publicationCollection: DataItemDescriptor) {
    // Change header
    this.data.changeHeader(publicationCollection.title);

    // Get title and introduction texts
    this.data.getPublicationCollection(this.data.projectName, publicationCollection).subscribe(
      data => {
        // TODO: Fix the reading of title and introduction
        this.titleText = this.stringNA;
        this.introductionText = this.stringNA;
      },
      err => { console.info(err); }
    );
    
  }

  onPublicationOpened(publication: DataItemDescriptor) {
    this.data.changeHeader(publication.title);
    // Show the publication GUI
    //this.showPublicationGUI = true;
    // TODO: Get reading text original
    this.readingText = this.stringNA;
    this.data.getPublication(this.data.projectName, publication.id).subscribe(
      data => {
        if(data.original_filename != null)
          this.readingText = data.original_filename;
      },
      err => { console.info(err); }
    );
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
          this.setPublicationCollectionTitle(result.path + '/' + result.name);
            break;
          case TextType.Introduction:
            this.setPublicationCollectionIntro(result.path + '/' + result.name);
            break;
          case TextType.ReadingText:
            this.setReadingText(result.path + '/' + result.name);
            break;
          case TextType.Version:
            break;
          case TextType.Manuscript:
            break;
        }
      }
    });
  }

  setPublicationCollectionTitle(fileName: string) {
    this.titleText = fileName;
    let collection: DataItemDescriptor = {type: DataItemType.PublicationCollection, id: this.data.publicationCollection, fileName: fileName};
    this.data.setPublicationCollectionTitle(this.data.projectName, collection).subscribe(
      data => {
        console.info(data);
      },
      err => { this.titleText = this.stringNA; }
    );
  }

  setPublicationCollectionIntro(fileName: string) {
    this.introductionText = fileName;
    let collection: DataItemDescriptor = {type: DataItemType.PublicationCollection, id: this.data.publicationCollection, fileName: fileName};
    this.data.setPublicationCollectionIntro(this.data.projectName, collection).subscribe(
      data => {
        console.info(data);
      },
      err => { this.introductionText = this.stringNA; }
    );
  }

  setReadingText(fileName: string) {
    this.readingText = fileName;
    let publication: DataItemDescriptor = {type: DataItemType.Publication, id: this.data.publication, fileName: fileName};
    this.data.editPublication(this.data.projectName, publication).subscribe(
      data => {
        console.info(data);
      },
      err => { this.readingText = this.stringNA; }
    );
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
