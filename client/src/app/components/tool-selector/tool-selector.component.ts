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

  xmlFileExtensions: string = environment.xml_file_extensions;
  xmlFile: string;

  @ViewChildren('selectorTab') selectorTabs:QueryList<ToolSelectorTabComponent>;
  // For testing viewchildren only
  //testString: string = "Oh yes indeed!";

  constructor(private data: DataService) { }

  ngOnInit() {
    // Change active tool
    this.data.changeTool("Selector");
    
    let xml_string: string = "<tei><note>Kommentar</note><p>This <placeName>Helsinki</placeName> <del>unpure</del><placeName>Larsmo</placeName><add>pure</add> <placeName>Umeå</placeName>gold<rs>Vasa</rs></p></tei>";

    //this.readXmlString(xml_string);

  }

  ngAfterViewInit() {
    // Do something with the child tabs
    //this.selectorTabs.forEach((child) => { child.header = this.testString; });
  }

  onFileInput(event: any) {
    // Get the list of selected files
    let files: FileList = event.target.files;
    // Create a file reader and create a callback for the file read
    let reader = new FileReader();
    reader.onload = () => {
      // Read contents of file to 'xmlFile'
      this.xmlFile = reader.result;
      // Parse xml string
      this.readXmlString(this.xmlFile);
    }
    // Read the file as text
    reader.readAsText(files.item(0));
    // Reset value of file input so same file(s) can be selected again
    event.srcElement.value = null;
  }

  readXmlString(xmlString: string) {
    this.xmlDoc = this.domParser.parseFromString(xmlString,"text/xml");

    // Ok
    //let xp : XPathResult = this.xmlDoc.evaluate('//placeName', this.xmlDoc.documentElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

    this.selectorTabs.forEach((child) => { 
      //child.xmlNodes = this.xmlNodes; 
      child.datLoadOccurences(this.xmlDoc);
    });

    /*for(let n of nodes) {
      alert(n.textContent);
    }*/

    //alert(this.xmlDoc.documentElement.innerHTML);

  }

  onDocumentLoaded(doc: DocumentDescriptor) {
    // Fetch the document from the server
    this.loadDocumentFromServer(doc);
  }

  loadDocumentFromServer(doc: DocumentDescriptor) {
    this.data.getDocument(doc).subscribe(
      data => { 
        // TODO: Read the actual returned document here
        alert(data);
      },
      err => {
        // Read contents of file to 'xmlFile'
        this.xmlFile = DataService.Base64DecodeUnicode("PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxURUkgeG1sbnM9Imh0dHA6Ly93d3cuc2xzLmZpL3RlaSI+DQogIDx0ZWlIZWFkZXI+DQogICAgPGZpbGVEZXNjPg0KICAgICAgPHRpdGxlU3RtdD4NCiAgICAgICAgPHRpdGxlPkxqdW5nYmxvbW1vciBJLCBIZnJzIDE4NDU8L3RpdGxlPg0KICAgICAgICA8cmVzcFN0bXQ+DQogICAgICAgICAgPHJlc3A+S29kbmluZzo8L3Jlc3A+DQogICAgICAgICAgPG5hbWU+Q0UgKDA3LTEwLTIwMDkpPC9uYW1lPg0KICAgICAgICA8L3Jlc3BTdG10Pg0KICAgICAgICA8cmVzcFN0bXQ+DQogICAgICAgICAgPHJlc3A+R3JhbnNrYWQgYXY6PC9yZXNwPg0KICAgICAgICAgIDxuYW1lPlRHICgyNi0xMC0yMDA5KTwvbmFtZT4NCiAgICAgICAgPC9yZXNwU3RtdD4NCiAgICAgIDwvdGl0bGVTdG10Pg0KICAgICAgPHB1YmxpY2F0aW9uU3RtdD4NCiAgICAgICAgPHB1Ymxpc2hlcj5aYWNoYXJpYXMgVG9wZWxpdXMgU2tyaWZ0ZXI8L3B1Ymxpc2hlcj4NCiAgICAgIDwvcHVibGljYXRpb25TdG10Pg0KICAgICAgPG5vdGVzU3RtdCAvPg0KICAgICAgPHNvdXJjZURlc2M+DQogICAgICAgIDxwIC8+DQogICAgICA8L3NvdXJjZURlc2M+DQogICAgPC9maWxlRGVzYz4NCiAgICA8ZW5jb2RpbmdEZXNjPjxjbGFzc0RlY2w+PHRheG9ub215IHhtbDppZD0iY2F0X2dlbnJlIj48Y2F0ZWdvcnkgeG1sOmlkPSJjZ19wb2VtIj48Y2F0RGVzYz5Qb2VtPC9jYXREZXNjPjwvY2F0ZWdvcnk+PGNhdGVnb3J5IHhtbDppZD0iY2dfbGV0dGVyIj48Y2F0RGVzYz5MZXR0ZXI8L2NhdERlc2M+PC9jYXRlZ29yeT48Y2F0ZWdvcnkgeG1sOmlkPSJjZ19jaGlsZHJlbnNsaXRlcmF0dXJlIj48Y2F0RGVzYz5DaGlsZHJlbidzIGxpdGVyYXR1cmU8L2NhdERlc2M+PC9jYXRlZ29yeT48Y2F0ZWdvcnkgeG1sOmlkPSJjZ19kaWFyeSI+PGNhdERlc2M+RGlhcnk8L2NhdERlc2M+PC9jYXRlZ29yeT48Y2F0ZWdvcnkgeG1sOmlkPSJjZ19ub25maWN0aW9uIj48Y2F0RGVzYz5Ob24tZmljdGlvbjwvY2F0RGVzYz48L2NhdGVnb3J5PjxjYXRlZ29yeSB4bWw6aWQ9ImNnX3Byb3NlIj48Y2F0RGVzYz5Qcm9zZTwvY2F0RGVzYz48L2NhdGVnb3J5PjxjYXRlZ29yeSB4bWw6aWQ9ImNnX2RyYW1hIj48Y2F0RGVzYz5EcmFtYTwvY2F0RGVzYz48L2NhdGVnb3J5PjwvdGF4b25vbXk+PHRheG9ub215IHhtbDppZD0iY2F0X2VkaXRvcmlhbCI+PGNhdGVnb3J5IHhtbDppZD0iY2VfcmVhZGluZ3RleHQiPjxjYXREZXNjPlJlYWRpbmcgdGV4dDwvY2F0RGVzYz48L2NhdGVnb3J5PjxjYXRlZ29yeSB4bWw6aWQ9ImNlX2ludHJvZHVjdGlvbiI+PGNhdERlc2M+SW50cm9kdWN0aW9uPC9jYXREZXNjPjwvY2F0ZWdvcnk+PGNhdGVnb3J5IHhtbDppZD0iY2VfdGl0bGVwYWdlIj48Y2F0RGVzYz5UaXRsZSBQYWdlPC9jYXREZXNjPjwvY2F0ZWdvcnk+PGNhdGVnb3J5IHhtbDppZD0iY2VfYW5ub3RhdGlvbnMiPjxjYXREZXNjPkFubm90YXRpb25zPC9jYXREZXNjPjwvY2F0ZWdvcnk+PGNhdGVnb3J5IHhtbDppZD0iY2VfYmFzZXRleHQiPjxjYXREZXNjPkJhc2UgdGV4dDwvY2F0RGVzYz48L2NhdGVnb3J5PjxjYXRlZ29yeSB4bWw6aWQ9ImNlX3ZlcnNpb24iPjxjYXREZXNjPlZlcnNpb248L2NhdERlc2M+PC9jYXRlZ29yeT48Y2F0ZWdvcnkgeG1sOmlkPSJjZV9tYW51c2NyaXB0Ij48Y2F0RGVzYz5NYW51c2NyaXB0PC9jYXREZXNjPjwvY2F0ZWdvcnk+PC90YXhvbm9teT48L2NsYXNzRGVjbD48L2VuY29kaW5nRGVzYz48cHJvZmlsZURlc2M+DQogICAgICA8aGFuZE5vdGVzPg0KICAgICAgICA8aGFuZE5vdGUgLz4NCiAgICAgICAgPGhhbmROb3RlIC8+DQogICAgICA8L2hhbmROb3Rlcz4NCiAgICA8Y3JlYXRpb24+PG9yaWdEYXRlPjE4NDUtMDAtMDA8L29yaWdEYXRlPjxpZE5vPjFfMTwvaWRObz48aWRObyB0eXBlPSJib29raWQiPjE8L2lkTm8+PHRpdGxlIHR5cGU9Im1haW4iPkxqdW5nYmxvbW1vcjwvdGl0bGU+PC9jcmVhdGlvbj48dGV4dENsYXNzPjxjYXRSZWYgdGFyZ2V0PSJjZ19wb2VtIiAvPjxjYXRSZWYgdGFyZ2V0PSJjZV9yZWFkaW5ndGV4dCIgLz48L3RleHRDbGFzcz48L3Byb2ZpbGVEZXNjPg0KICAgIDxyZXZpc2lvbkRlc2M+DQogICAgICA8Y2hhbmdlPg0KICAgICAgPC9jaGFuZ2U+DQogICAgICA8Y2hhbmdlPg0KICAgICAgPC9jaGFuZ2U+DQogICAgPC9yZXZpc2lvbkRlc2M+DQogIDwvdGVpSGVhZGVyPg0KICA8dGV4dD4NCiAgICA8Ym9keSB4bWw6c3BhY2U9InByZXNlcnZlIj4NCiAgICAgIDwhLS0g4oCTIMK7IOKAmSAtLT4NCiAgICAgIDxkaXYgdHlwZT0icG9lbSI+DQogICAgICAgIDxwYiB0eXBlPSJvcmlnIHVucHJpbnRlZCIgbj0iMSIgLz4NCiAgICAgICAgPHBiIHR5cGU9IlpUUyIgbj0iMyIgLz4NCiAgICAgICAgPGhlYWQgdHlwZT0idGl0bGUiIHhtbDppZD0iaDEiPkxqdW5nYmxvbW1vci48L2hlYWQ+DQogICAgICAgIDxsZyB4bWw6aWQ9ImxnMSI+DQogICAgICAgICAgPGwgbj0iMSI+VmlsZGEgc2tvZ2VuIGhhciBzaW4gYmxvbW1hPC9sPg0KICAgICAgICAgIDxsIG49IjIiPk9jaCBzaW4gZG9mdCBoYXIgw7ZkZW1hcmtlbiw8L2w+DQogICAgICAgICAgPGwgbj0iMyI+TGp1bmdlbiBoYXIgc2luIGJsZWthIHJvZG5hZCw8L2w+DQogICAgICAgICAgPGwgbj0iNCI+SGVkZW4gw6RnZXIgb2NrIHNpbiBnbMOkZGplOzwvbD4NCiAgICAgICAgICA8cGIgdHlwZT0ib3JpZyB1bnByaW50ZWQiIG49IjIiIC8+DQogICAgICAgICAgPGwgbj0iNSI+T2NoIGRldCByaWthIG1lbnNrb2hqZXJ0YXQsPC9sPg0KICAgICAgICAgIDxsIG49IjYiPg0KICAgICAgICAgICAgPGFuY2hvciB4bWw6aWQ9InN0YXJ0MzUwIiAvPlNrYWxsLCBtZXIgYXJtdCDDpG4gw7ZkZW1hcmtlbiw8L2w+DQogICAgICAgICAgPGwgbj0iNyI+RmF0dGlndCBtZXIgw6RuIHNvcmdzbmEgaGVkZW4sPC9sPg0KICAgICAgICAgIDxsIG49IjgiPkRldCBlaiBzaW5hIGJsb21tb3IgYsOkcmEsPC9sPg0KICAgICAgICAgIDxsIG49IjkiPlNqZWxmIHNpbiBsanVmdmEgdHLDtnN0IGVqIG7DpHJhPzxhbmNob3IgeG1sOmlkPSJlbmQzNTAiIC8+PC9sPg0KICAgICAgICA8L2xnPg0KICAgICAgICA8bGcgeG1sOmlkPSJsZzIiPg0KICAgICAgICAgIDxsIG49IjEwIj4NCiAgICAgICAgICAgIDxhbmNob3IgeG1sOmlkPSJzdGFydDM1NyIgLz5Ow6VncmEgc8OlbmdlciBoYXIgamFnIHNqdW5naXQsPC9sPg0KICAgICAgICAgIDxsIG49IjExIj5Ow6RyIGkgYnLDtnN0ZXQgaGplcnRhdCBicsOkbmRlLDwvbD4NCiAgICAgICAgICA8bCBuPSIxMiI+DQogICAgICAgICAgICA8YW5jaG9yIHhtbDppZD0ic3RhcnQzNTYiIC8+U2p1bmdpdCBkZW0gZsO2ciA8YW5jaG9yIHhtbDppZD0ic3RhcnQzNTEiIC8+PHBlcnNOYW1lPkVsbGlzPC9wZXJzTmFtZT48YW5jaG9yIHhtbDppZD0iZW5kMzUxIiAvPiBnbMOkZGplPC9sPg0KICAgICAgICAgIDxsIG49IjEzIj5PY2ggZsO2ciA8YW5jaG9yIHhtbDppZD0ic3RhcnQzNTIiIC8+PHBlcnNOYW1lPkFpbmFzPC9wZXJzTmFtZT48YW5jaG9yIHhtbDppZD0iZW5kMzUyIiAvPiBhZnRvbnRhbmthcjs8L2w+DQogICAgICAgICAgPGwgbj0iMTQiPg0KICAgICAgICAgICAgPGFuY2hvciB4bWw6aWQ9InN0YXJ0MzUzIiAvPg0KICAgICAgICAgICAgPHBlcnNOYW1lPlNlbG1hczwvcGVyc05hbWU+DQogICAgICAgICAgICA8YW5jaG9yIHhtbDppZD0iZW5kMzUzIiAvPiBwYW5uYSBkZXJ2aWQgbGp1c25hdCw8L2w+DQogICAgICAgICAgPGwgbj0iMTUiPg0KICAgICAgICAgICAgPGFuY2hvciB4bWw6aWQ9InN0YXJ0MzU0IiAvPg0KICAgICAgICAgICAgPHBlcnNOYW1lPkZhbm55czwvcGVyc05hbWU+DQogICAgICAgICAgICA8YW5jaG9yIHhtbDppZD0iZW5kMzU0IiAvPiDDtm1tYSDDtmdvbiBza2ltcmF0LDwvbD4NCiAgICAgICAgICA8bCBuPSIxNiI+DQogICAgICAgICAgICA8YW5jaG9yIHhtbDppZD0ic3RhcnQzNTUiIC8+DQogICAgICAgICAgICA8cGVyc05hbWUgY29ycmVzcD0icGUxMCI+RW1tYXM8L3BlcnNOYW1lPg0KICAgICAgICAgICAgPGFuY2hvciB4bWw6aWQ9ImVuZDM1NSIgLz4gYmxpZGEgYmzDpWEgYmxpY2thcjxhbmNob3IgeG1sOmlkPSJlbmQzNTYiIC8+PC9sPg0KICAgICAgICAgIDxsIG49IjE3Ij5LbGFyYXJlIMOkbiBzdGplcm5vciBzdHLDpWxhdC48YW5jaG9yIHhtbDppZD0iZW5kMzU3IiAvPjwvbD4NCiAgICAgICAgICA8bCBuPSIxOCI+U8OlIGkgdmFja3JhIMO2Z29ucyB2w6RybWE8L2w+DQogICAgICAgICAgPGwgbj0iMTkiPlPDpW5nZXJuYSBsaWt0IGRyaWZ2b3Igc211bHRpdCw8L2w+DQogICAgICAgICAgPGwgbj0iMjAiPlJ1bm5pdCB1cHAgc29tIG1vcmdvbmRyw7ZtbWFyIDwvbD4NCiAgICAgICAgICA8bCBuPSIyMSI+SSBldHQgdsOlcmxpZ3QgaGplcnRhcyBrw6RybGVrLjwvbD4NCiAgICAgICAgICA8bCBuPSIyMiI+TnUgamFnIHNhbWxhdCBoYXIgZGUgc3DDpGRhLDwvbD4NCiAgICAgICAgICA8bCBuPSIyMyI+DQogICAgICAgICAgICA8YW5jaG9yIHhtbDppZD0ic3RhcnQzNTgiIC8+U2tpY2thciBkZW0gw6V0IDxwbGFjZU5hbWUgeG1sOmxhbmc9ImZpbiIgY29ycmVzcD0icGw2MiI+U3VvbWlzPC9wbGFjZU5hbWU+IGZsaWNrb3IsPGFuY2hvciB4bWw6aWQ9ImVuZDM1OCIgLz48L2w+DQogICAgICAgICAgPGwgbj0iMjQiPkF0dCBlbiBzb3Jnc2VuIHN0dW5kIGbDtnJkcmlmdmEsPC9sPg0KICAgICAgICAgIDxsIG49IjI1Ij5BdHQgaSB2w6VyZW5zIGRvZnQgb2NoIGzDpG5ndGFuIDwvbD4NCiAgICAgICAgICA8bCBuPSIyNiI+U8OlbmdlbnMgcm8gZGUgaHVsZGEgZ2lmdmEuPC9sPg0KICAgICAgICA8L2xnPg0KICAgICAgICA8ZGF0ZWxpbmU+DQogICAgICAgICAgPGRhdGUgd2hlbj0iMTg0NSI+PHN1cHBsaWVkIHNvdXJjZT0iU8OlbmdlciBJLCBTdGhsbSAxODYwIj4xODQ1Ljwvc3VwcGxpZWQ+PC9kYXRlPg0KICAgICAgICA8L2RhdGVsaW5lPg0KICAgICAgPC9kaXY+DQogICAgICANCiAgICA8L2JvZHk+DQogIDwvdGV4dD4NCjwvVEVJPg==");
        // Parse xml string
        this.readXmlString(this.xmlFile);
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
