import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {GridColumnStatusComponent} from '../grid-column-status/grid-column-status.component';
import { DocumentDescriptor, DataService } from '../../services/data.service';

import {GridOptions, RowNode} from 'ag-grid';

@Component({
    selector: 'app-grid-documents',
    templateUrl: './grid-documents.component.html'
})
export class GridDocumentsComponent implements OnInit {

  gridOptions: GridOptions;
  columnDefs: any[];
  rowData: any[];
  treeData: any;

  pathCurrent: string = '';
  pathNew: string = '';
  pathParent: string = '';

  fileSelected: boolean = false;
  openDocument: string = '';

  @Input() openFileText: string = 'Open File';
  // Root folder support is not yet implemented
  @Input() rootFolder: string = '';
  @Input() doubleClickToOpenFile: boolean = true;
  @Input() displayCancelButton: boolean = false;
  @Output() documentLoaded: EventEmitter<DocumentDescriptor> = new EventEmitter<DocumentDescriptor>();

  constructor(private data: DataService) {

    this.gridOptions = <GridOptions>{
      enableSorting: true,
      rowSelection: 'single',
      overlayLoadingTemplate: '<span><div class="spinner"></div></span>'
    };

    this.gridOptions.getRowStyle = function(params) {
      if (params.node.data.type === 'Folder') {
          return { color: '#0000AA' };
      }
    };

    this.columnDefs = [
        {headerName: 'Name', field: 'name'},
        {headerName: 'Type', field: 'type'}
    ];
  }

  ngOnInit() {
    // Get the folder structure
    setTimeout(() => {
      this.getTree(this.pathNew, false);
    }, 1000);

  }

  getTree(path: string, forceRefresh: boolean) {
    this.gridOptions.api.showLoadingOverlay();
    // Get "root" folder? In this case we need to send a request to the server
    if (path.length === 0) {
      if(this.data.dataDocuments === undefined || forceRefresh) {
        this.data.getDocumentTree(path, false).subscribe(
          data => {
            this.treeData = data;
            this.data.dataDocuments = data;
            this.showPath(this.pathNew);
          },
          err => { console.log(err); }
        );
      }
      else {
        this.treeData = this.data.dataDocuments;
        this.showPath(this.pathNew);
      }
    }
    // Child folder
    else {
      this.fillTree(path);
    }
  }

  fillTree(path: string) {
    // Create a variable for temporary tree data. Add the default parent folder.
    let tmpRowData = [{"name": "..", "type": "Folder"}];
    // Get object of folder (only supports one level yet, should support multiple levels)
    var tmpTreeData: any;
    if(path.length == 0)
      tmpTreeData = this.treeData;
    else
      tmpTreeData = this.treeData[path];
    // Iterate the temporary tree
    for (var key in tmpTreeData) {
      if (tmpTreeData.hasOwnProperty(key)) {
        // Check if folder (property not null)
        if(tmpTreeData[key] != null) {
          tmpRowData.push({'name': key, 'type': "Folder"});
        }
        // otherwise assume file
        else {
          tmpRowData.push({'name': key, 'type': "File"});
        }
      }
    }
    this.rowData = tmpRowData;
  }

  onGridReady(params) {
      params.api.sizeColumnsToFit();
  }

  onSelectionChanged() {
    const rowSelection = this.gridOptions.api.getSelectedRows();
    if(rowSelection.length > 0) {
      if(rowSelection[0].type == "File")
        this.fileSelected = true;
      else
        this.fileSelected = false;
    }
  }

  onRowClick(event) {
    /*// Is the clicked item a folder?
    if(event.data.type == "Folder") {
      this.gridOptions.api.showLoadingOverlay();
      // Show loading overlay of grid
      //this.gridOptions.api.showLoadingOverlay()
      // Clear grid
      this.rowData = [];
      // "Parent" folder
      if(event.data.name.startsWith("..")) {
        // Set potential new path to be parent path
        this.pathNew = this.pathParent;
        // Send the request to the server
        this.showPath(this.pathNew);
        //this.getTree(this.pathNew);
      }
      // "Normal" folder
      else {
        // Set the potential new path to the current path + the clicked item name
        this.pathNew = this.pathCurrent + (this.pathCurrent.length > 0 ? '/' : '') + event.data.name;
        // Send the request to the server
        this.showPath(this.pathNew);
        //this.getTree(this.pathNew);
      }

    }
    // Assume file
    else {
      if(!this.doubleClickToOpenFile) {
        let doc: DocumentDescriptor = {name: event.data.name, path: this.pathCurrent};
        this.documentLoaded.emit(doc);
      }
    }*/
  }

  showPath(path: string) {
    let tmpRowData = [];

    var tmpTreeData = this.treeData;
    let paths = path.split('/');
    // If not root path, add parent folder link and traverse through data until reaching correct path
    if(path.length > 0) {
      tmpRowData.push({"name": "..", "type": "Folder"});
      for(var i=0; i<paths.length; i++)
        tmpTreeData = tmpTreeData[paths[i]];
    }
    // Iterate the temporary tree
    for (var key in tmpTreeData) {
      if (tmpTreeData.hasOwnProperty(key)) {
        // Check if folder (property not null)
        if(tmpTreeData[key] != null) {
          tmpRowData.push({'name': key, 'type': "Folder"});
        }
        // otherwise assume file
        else {
          tmpRowData.push({'name': key, 'type': "File"});
        }
      }
    }
    // Update grid
    this.rowData = tmpRowData;
    // Set current path to new path
    this.pathCurrent = path;
  }

  onRowDoubleClick(event) {
    // Is the clicked item a folder?
    if(event.data.type == "Folder") {
      this.gridOptions.api.showLoadingOverlay();
      // Show loading overlay of grid
      //this.gridOptions.api.showLoadingOverlay()
      // Clear grid
      this.rowData = [];
      // "Parent" folder
      if(event.data.name.startsWith("..")) {
        // Set potential new path to be parent path
        this.pathNew = this.pathParent;
        // Send the request to the server
        this.showPath(this.pathNew);
        //this.getTree(this.pathNew);
      }
      // "Normal" folder
      else {
        // Set the potential new path to the current path + the clicked item name
        this.pathNew = this.pathCurrent + (this.pathCurrent.length > 0 ? '/' : '') + event.data.name;
        // Send the request to the server
        this.showPath(this.pathNew);
        //this.getTree(this.pathNew);
      }

    }
    // Assume file
    else {
      if(this.doubleClickToOpenFile && event.data.type == "File") {
        const doc: DocumentDescriptor = {name: event.data.name, path: this.pathCurrent};
        this.documentLoaded.emit(doc);
      }
    }
    /*if(this.doubleClickToOpenFile && event.data.type == "File") {
      const doc: DocumentDescriptor = {name: event.data.name, path: this.pathCurrent};
      this.documentLoaded.emit(doc);
    }*/
  }

  onRefreshClick() {
    // Clear grid
    //this.rowData = [];
    // Get root folder (refresh)
    this.pathNew = "";
    this.getTree(this.pathNew, true);
    // Reset current path
    this.pathCurrent = "";
  }

  onLoadClick() {
    // Load xml from server
    const rowSelection = this.gridOptions.api.getSelectedRows();
    if(rowSelection.length > 0) {
      if(rowSelection[0].type == "File") {
        const doc: DocumentDescriptor = {name: rowSelection[0].name, path: this.pathCurrent};
        this.documentLoaded.emit(doc);
      }
    }
  }

  onCancelClick() {
    // Send empty strings when cancel is clicked
    const doc: DocumentDescriptor = {name: "", path: ""};
    this.documentLoaded.emit(doc);
  }

  // TODO: Remove this
  onDummyClick() {
    const doc: DocumentDescriptor = {name: '10_13_est.xml', path: 'xml/est'};
    this.documentLoaded.emit(doc);
  }
}

