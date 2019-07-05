import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-tool-tagger',
  templateUrl: './tool-tagger.component.html',
  styleUrls: ['./tool-tagger.component.css']
})
export class ToolTaggerComponent implements OnInit {

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.changeTool('Tagger');
  }

}
