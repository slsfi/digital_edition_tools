import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-tool-editor',
  templateUrl: './tool-editor.component.html',
  styleUrls: ['./tool-editor.component.css']
})
export class ToolEditorComponent implements OnInit {
  configurations = environment.selector_configurations;
  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.changeTool('Editor');
  }

}
