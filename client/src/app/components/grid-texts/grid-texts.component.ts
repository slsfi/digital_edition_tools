import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { GridOptions, RowNode } from 'ag-grid';
import { ChildEvent, ChildEventType, DataService, DataItemType, DataItemDescriptor } from '../../services/data.service';
import { DialogDataComponent } from '../dialog-data/dialog-data.component';
import { DialogGitComponent } from '../dialog-git/dialog-git.component';

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
      enableColResize: true,
      rowSelection: 'single',
      rowDragManaged: true,
      overlayLoadingTemplate: '<span><div class="spinner"></div></span>'
    };

    // Set callback so rows can be found with the getRowNode function
    this.gridOptions.getRowNodeId = function(data) {
      return data.id;
    };

    // Grid columns
    this.columnDefs = [
      {headerName: 'Title', field: 'title', width: 230, rowDrag: true},
      {headerName: 'Id', field: 'id', hide: true},
      {headerName: 'Filename', field: 'filename', width: 400}
    ];

  }

  ngOnInit() {
  }

  onGridReady(params) {
    // Do something when grid has initialized
  }

  onRowDragEnd(event: any) {
    this.gridOptions.api.forEachNodeAfterFilterAndSort( (node) => {
      switch(this.dataType) {
        case DataItemType.Version:
          let version: DataItemDescriptor = {type: DataItemType.Version, id: node.data.id, sort_order: node.childIndex+1};
          this.data.editVersion(this.data.projectName, version).subscribe(
            data => { },
            err => { console.log(err); }
          );
          break;

        case DataItemType.Manuscript:
          let manuscript: DataItemDescriptor = {type: DataItemType.Manuscript, id: node.data.id, sort_order: node.childIndex+1};
          this.data.editManuscript(this.data.projectName, manuscript).subscribe(
            data => { },
            err => { console.log(err); }
          );
          break;
      }
    });
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
    const selRows = this.gridOptions.api.getSelectedRows();
    if(selRows.length == 1) {
      //this.linkItemEditedId = selRows[0].id;
      this.showGitDialog();
    }
    else
      alert('You need to select a row to link a file!');
  }

  showGitDialog() {
    const dialogRef = this.dialog.open(DialogGitComponent, {
      width: '700px',
      data: {name: "", path: ""}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.name.length > 0) {
        // Get selected rows of grid
        let selRows = this.gridOptions.api.getSelectedRows();
        // Create a data item and set the path to the selected file
        const dataItem: DataItemDescriptor = {type: this.dataType, id: selRows[0].id, title: selRows[0].title, fileName: result.path + '/' + result.name};
        // Keep track of edited item, this will be used if server request is successful
        this.dataItemEdited = dataItem;
        // Edit the item (send request to server)
        this.editItem(dataItem);
      }
    });
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
    dataItem.sort_order = this.gridOptions.api.getDisplayedRowCount()+1;
    switch(dataItem.type) {
      case DataItemType.Version:
        this.data.addVersion(this.data.projectName, this.data.publication, dataItem).subscribe(
          data => {
            // Set id from returned data
            this.dataItemEdited.id = data.version_id;
            // Add row
            this.addRow(data);
          },
          err => { console.log(err); }
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
          err => { console.log(err); }
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
          err => { console.log(err); }
        );
        break;
      case DataItemType.Manuscript:
        this.data.editManuscript(this.data.projectName, dataItem).subscribe(
          data => {
            this.editRow(data);
          },
          err => { console.log(err); }
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