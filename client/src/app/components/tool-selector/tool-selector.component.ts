import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DocumentDescriptor, DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment.prod';
import { saveAs } from 'file-saver/FileSaver';
import { ToolSelectorTabComponent } from '../tool-selector-tab/tool-selector-tab.component';

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

  showSpinner: boolean = false;

  xmlFileExtensions: string = environment.xml_file_extensions;
  xmlFile: string;

  @ViewChildren('selectorTab') selectorTabs:QueryList<ToolSelectorTabComponent>;
  // For testing viewchildren only
  // testString: string = "Oh yes indeed!";

  constructor(private data: DataService) { }

  ngOnInit() {
    // Change active tool
    this.data.changeTool('Selector');

    let xml_string: string = '<tei><note>Kommentar</note><p>This <placeName>Helsinki</placeName> <del>unpure</del><placeName>Larsmo</placeName><add>pure</add> <placeName>Umeå</placeName>gold<rs>Vasa</rs></p></tei>';

    // this.readXmlString(xml_string);

  }

  ngAfterViewInit() {
    // Do something with the child tabs
    // this.selectorTabs.forEach((child) => { child.header = this.testString; });
  }

  onFileInput(event: any) {
    // Get the list of selected files
    const files: FileList = event.target.files;
    // Create a file reader and create a callback for the file read
    const reader = new FileReader();
    reader.onload = () => {
      // Read contents of file to 'xmlFile'
      this.xmlFile = reader.result;
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
    this.xmlDoc = this.domParser.parseFromString(xmlString,'text/xml');

    // Ok
    // let xp : XPathResult = this.xmlDoc.evaluate('//placeName', this.xmlDoc.documentElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

    this.selectorTabs.forEach((child) => {
      //child.xmlNodes = this.xmlNodes;
      child.datLoadOccurences(this.xmlDoc);
    });

    /*for(let n of nodes) {
      alert(n.textContent);
    }*/

    // Hide spinner
    this.showSpinner = false;

    //alert(this.xmlDoc.documentElement.innerHTML);

  }

  onDocumentLoaded(doc: DocumentDescriptor) {
    this.showSpinner = true;
    // Fetch the document from the server
    this.loadDocumentFromServer(doc);
  }

  loadDocumentFromServer(doc: DocumentDescriptor) {
    this.data.getDocument(doc, false).subscribe(
      data => {
        // Decode base64 encoded xml file to a string
        this.xmlFile = DataService.Base64DecodeUnicode(data.file);
        // Parse the xml string
        this.readXmlString(this.xmlFile);
        // Console
       // console.info(this.xmlFile);
      },
      err => {
        this.showSpinner = false;
      }
    );
  }

  onSaveFileLocal() {
    this.saveToFileSystem();
  }

  private saveToFileSystem() {
    // Convert xml to string and set Windows style line breaks
    //const stringToSave = this.xmlDoc.documentElement.outerHTML.replace(/\n/g,"\r\n");
    // Serialize xml document to string
    const serializer = new XMLSerializer();
    let stringToSave = serializer.serializeToString(this.xmlDoc);
    // Convert line breaks to wanted format
    stringToSave = stringToSave.replace(/\r\n/g,"\n");
    stringToSave = stringToSave.replace(/(\r|\n)/g, environment.line_break);
    // Add space after trailing slash (self closed tag)?
    if(environment.xml_space_before_trailing_slash)
      stringToSave = stringToSave.replace(/\/\>/g," />");
    // Create a blob from the string
    const blob = new Blob([stringToSave], { type: 'text/plain' });
    // Save the blob
    saveAs(blob, "_text.xml");
  }

}
