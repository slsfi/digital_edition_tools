import { Component, OnInit } from '@angular/core';
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-tool-facsimiles',
  templateUrl: './tool-facsimiles.component.html',
  styleUrls: ['./tool-facsimiles.component.css']
})
export class ToolFacsimilesComponent implements OnInit {

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.changeTool("Facsimiles");
  }

}
