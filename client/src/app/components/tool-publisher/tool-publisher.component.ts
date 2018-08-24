import { Component, OnInit } from '@angular/core';
import { DocumentDescriptor, DataService } from "../../services/data.service";

@Component({
  selector: 'app-tool-publisher',
  templateUrl: './tool-publisher.component.html',
  styleUrls: ['./tool-publisher.component.css']
})
export class ToolPublisherComponent implements OnInit {

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.changeTool("Publisher");
  }

  onDocumentLoaded(doc: DocumentDescriptor) {
    alert(doc.name);
  }

}
