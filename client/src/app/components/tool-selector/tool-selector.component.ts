import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DocumentDescriptor, DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment.prod';
import { saveAs } from 'file-saver/FileSaver';
import { ToolSelectorTabComponent } from '../tool-selector-tab/tool-selector-tab.component';
import { FileDialogComponent } from '../file-dialog/file-dialog.component';

@Component({
  selector: 'app-tool-selector',
  templateUrl: './tool-selector.component.html',
  styleUrls: ['./tool-selector.component.css'],
})
export class ToolSelectorComponent implements OnInit {

  configurations = environment.selector_configurations;
  xmltest: string;

  xmlDoc: XMLDocument;
  xmlNodes: Node[] = [];
  domParser = new DOMParser();

  openedDocumentServer: DocumentDescriptor = {name: '', path: ''};
  fileNameLocal = '';

  // showSpinner: boolean = false;

  // TODO: Fix this, master files should be used!?
  useMasterFiles = false;

  xmlFileExtensions: string = environment.xml_file_extensions;
  xmlFile: string;

  @ViewChildren('selectorTab') selectorTabs: QueryList<ToolSelectorTabComponent>;

  constructor(private data: DataService, public dialog: MatDialog) { }

  ngOnInit() {
    // Change active tool
    this.data.changeTool('Selector');
  }

  ngAfterViewInit() {
    // Do something with the child tabs
    // this.selectorTabs.forEach((child) => { child.header = this.testString; });
  }

  onFileInput(event: any) {
    // Get the list of selected files
    const files: FileList = event.target.files;
    // set filename
    this.openedDocumentServer = {name: '', path: ''};
    this.fileNameLocal = event.target.files[0].name;
    // Create a file reader and create a callback for the file read
    const reader = new FileReader();
    reader.onload = () => {
      // Show overlays for occurence grids
      this.selectorTabs.forEach((child) => {
        child.showLoadingOverlay();
      });
      // Read contents of file to 'xmlFile'
      this.xmlFile = reader.result.toString();
      // Parse xml string
      this.readXmlString(this.xmlFile);
    };
    // Read the file as text
    reader.readAsText(files.item(0));
    // Reset value of file input so same file(s) can be selected again
    event.srcElement.value = null;
  }

  readXmlString(xmlString: string) {

    // Remove possible BOM from start of string
    if (xmlString.charCodeAt(0) === 0xFEFF) {
      xmlString = xmlString.substr(1);
    }

    // Parse the xml string into a xml dom object
    this.xmlDoc = this.domParser.parseFromString(xmlString, 'text/xml');

    // Ok
    this.selectorTabs.forEach((child) => {
      child.datLoadOccurences(this.xmlDoc);
    });

    /*for(let n of nodes) {
      alert(n.textContent);
    }*/

  }

  onDocumentLoaded(doc: DocumentDescriptor) {
    /// this.showSpinner = true;
    // Fetch the document from the server
    if (doc.name.length > 0) {
      this.loadDocumentFromServer(doc);
    }
  }

  onLoadFileServer(event: any) {
    this.showDialogLoad();
  }

  showDialogLoad() {
    const dialogRef = this.dialog.open(FileDialogComponent, {
      width: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle result
      this.loadDocumentFromServer(result as DocumentDescriptor);
    });
  }

  loadDocumentFromServer(doc: DocumentDescriptor) {
    // Set opened document
    this.openedDocumentServer = doc;
    this.fileNameLocal = doc.name;
    // Set tab data
    this.selectorTabs.forEach((child) => {
      child.showLoadingOverlay();
      child.fileName = doc.path + '/' + doc.name;
    });
    // Load document
    this.data.getDocument(doc, this.useMasterFiles).subscribe(
      data => {
        // Decode base64 encoded xml file to a string
        this.xmlFile = DataService.Base64DecodeUnicode(data.file);
        // Parse the xml string
        this.readXmlString(this.xmlFile);
        // Console
       // console.info(this.xmlFile);
      },
      err => { }
    );
  }

  onSaveFileLocal() {
    this.saveToFileSystem();
  }

  private saveToFileSystem() {
    // Convert xml to string and set Windows style line breaks
    const stringToSave = this.processXmlForSaving(this.xmlDoc);
    // Create a blob from the string
    const blob = new Blob([stringToSave], { type: 'text/plain' });
    // Save the blob
    saveAs(blob, this.fileNameLocal);
  }

  onSaveFileServer() {
    if (this.openedDocumentServer.name.length > 0) {
      const stringToSave = this.processXmlForSaving(this.xmlDoc);
      this.data.putDocument(this.openedDocumentServer, stringToSave, this.useMasterFiles).subscribe(
        data => {
          console.log(data);
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  processXmlForSaving(xml: XMLDocument): string {
    // Serialize xml document to string
    const serializer = new XMLSerializer();
    let stringToSave = serializer.serializeToString(xml);
    // Convert line breaks to wanted format
    stringToSave = stringToSave.replace(/\r\n/g, '\n');
    stringToSave = stringToSave.replace(/(\r|\n)/g, environment.line_break);
    // Add space after trailing slash (self closed tag)?
    if (environment.xml_space_before_trailing_slash) {
      stringToSave = stringToSave.replace(/\/\>/g, ' />');
    }
    // Return processed string
    return stringToSave;
  }

}
