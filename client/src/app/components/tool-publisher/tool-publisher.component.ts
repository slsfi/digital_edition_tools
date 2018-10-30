import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DocumentDescriptor, DataService } from "../../services/data.service";
import { ListLevel } from "../grid-publications/grid-publications.component";
import { DialogGitComponent } from '../dialog-git/dialog-git.component';

@Component({
  selector: 'app-tool-publisher',
  templateUrl: './tool-publisher.component.html',
  styleUrls: ['./tool-publisher.component.css']
})
export class ToolPublisherComponent implements OnInit {

  textType: TextType = TextType.None;
  public Level: any = ListLevel;
  listLevel: ListLevel = ListLevel.projects;

  constructor(private data: DataService, public dialog: MatDialog) { }

  ngOnInit() {
    this.data.changeTool("Publisher");
  }

  onListLevelChanged(level: ListLevel) {
    this.listLevel = level;
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
