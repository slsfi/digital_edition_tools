import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { GridOptions, RowNode } from 'ag-grid';
import { ChildEvent, ChildEventType, DataService, DataItemType, DataItemDescriptor } from '../../services/data.service';
import { DialogDataComponent } from '../dialog-data/dialog-data.component';

@Component({
  selector: 'app-grid-texts',
  templateUrl: './grid-texts.component.html',
  styleUrls: ['./grid-texts.component.css']
})
export class GridTextsComponent implements OnInit {

  gridOptions: GridOptions;
  columnDefs: any[];
  showRemove: boolean = false;

  dataItemEdited: DataItemDescriptor;

  @Input() rowData: any[];
  @Input() dataType: DataItemType = DataItemType.Version;
  @Output() addClick: EventEmitter<ChildEvent> = new EventEmitter<ChildEvent>();
  @Output() editClick: EventEmitter<ChildEvent> = new EventEmitter<ChildEvent>();
  @Output() removeClick: EventEmitter<ChildEvent> = new EventEmitter<ChildEvent>();
  @Output() linkFileClick: EventEmitter<ChildEvent> = new EventEmitter<ChildEvent>();

  constructor(private data: DataService, public dialog: MatDialog) { 

    // Set up the grid
    this.gridOptions = <GridOptions>{
      enableSorting: false,
      rowSelection: 'single',
      overlayLoadingTemplate: '<span><div class="spinner"></div></span>'
    };

    // Set callback so rows can be found with the getRowNode function
    this.gridOptions.getRowNodeId = function(data) {
      return data.id;
    };

    // Grid columns
    this.columnDefs = [
      {headerName: 'Title', field: 'title', width: 230},
      {headerName: 'Id', field: 'id', hide: true},
      {headerName: 'Filename', field: 'filename', width: 400}
    ];

  }

  ngOnInit() {
  }

  onGridReady(params) {
    // Do something when grid has initialized
  }

  showLoadingOverlay() {
    this.gridOptions.api.showLoadingOverlay();
  }

  onAddClick() {
    //const doc: ChildEvent = {type: ChildEventType.Add};
    //this.addClick.emit(doc);
    const dataEmpty: DataItemDescriptor = {type: this.dataType};
    this.showDataDialog(dataEmpty);
  }

  onEditClick() {
    const selRows = this.gridOptions.api.getSelectedRows();
    if(selRows.length == 1) {
      const dataItem: DataItemDescriptor = {type: this.dataType, id: selRows[0].id, title: selRows[0].title, fileName: selRows[0].filename};
      this.showDataDialog(dataItem);
      //const doc: ChildEvent = {type: ChildEventType.Edit};
      //this.editClick.emit(doc);
    }
    else
      alert('You need to select a row to edit!');
  }
  
  // Remove clicked, not currently implemented
  onRemoveClick() {
    /*const rowSelection = this.gridOptions.api.getSelectedRows();
    if(rowSelection.length == 1) {
      const doc: ChildEvent = {type: ChildEventType.Remove};
      this.removeClick.emit(doc);
    }*/
  }

  onLinkFileClick() {
    const rowSelection = this.gridOptions.api.getSelectedRows();
    if(rowSelection.length == 1) {
      const doc: ChildEvent = {type: ChildEventType.LinkFile};
      this.linkFileClick.emit(doc);
    }
    else
      alert('You need to select a row to link a file!');
  }

  showDataDialog(dataItem: DataItemDescriptor) {
    // Show the dialog
    const dialogRef = this.dialog.open(DialogDataComponent, {
      width: '700px',
      data: dataItem
    });
    // Subscribe to dialog closed event
    dialogRef.afterClosed().subscribe(result => {
      // If title is undefined, then user cancelled the dialog
      if(result.title !== undefined) { 
        // Keep track of edited item, this will be used if server request is successful
        this.dataItemEdited = result;
        // id is defined, means that an item has been edited
        if(result.id !== undefined)
          this.editItem(result);
        // Id is not defined, add item
        else
          this.addItem(result);
      }
    });
  }

  addItem(dataItem: DataItemDescriptor) {
    switch(dataItem.type) {
      case DataItemType.Version:
        this.data.addVersion(this.data.projectName, this.data.publication, dataItem).subscribe(
          data => {
            // Set id from returned data
            this.dataItemEdited.id = data.version_id;
            // Add row
            this.addRow(data);
          },
          err => { console.info(err); }
        );
        break;

      case DataItemType.Manuscript:
        this.data.addManuscript(this.data.projectName, this.data.publication, dataItem).subscribe(
          data => {
            // Set id from returned data
            this.dataItemEdited.id = data.manuscript_id;
            // Add row
            this.addRow(data);
          },
          err => { console.info(err); }
        );
        break;
    }
  }

  // Edit an item
  editItem(dataItem: DataItemDescriptor) {
    switch(dataItem.type) {
      case DataItemType.Version:
        this.data.editVersion(this.data.projectName, dataItem).subscribe(
          data => {
            this.editRow(data);
          },
          err => { console.info(err); }
        );
        break;
      case DataItemType.Manuscript:
        this.data.editManuscript(this.data.projectName, dataItem).subscribe(
          data => {
            this.editRow(data);
          },
          err => { console.info(err); }
        );
        break;
    }
  }

  addRow(data: any) {
    // Create a grid row item from the project data
    const rowDataItem = this.createGridData(this.dataItemEdited);
    // Add the new project row to the grid
    this.gridOptions.api.updateRowData({add: [rowDataItem]});
  }

  editRow(data: any) {
    // Get the row node with the id of the edited item
    let rowNode = this.gridOptions.api.getRowNode(this.dataItemEdited.id.toString());
    // Set the new item row data
    rowNode.setData(this.createGridData(this.dataItemEdited));
  }

  createGridData(dataItem: DataItemDescriptor): any {
    let newData = {'title': dataItem.title, 'id': dataItem.id, 'filename': dataItem.fileName};
    return newData;
  }

}