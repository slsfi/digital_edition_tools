import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { GridOptions, RowNode } from 'ag-grid';
import { ChildEvent, ChildEventType, DataService, DataItemType, DataItemDescriptor, TagDescriptor } from '../../services/data.service';
import { DialogDataComponent } from '../dialog-data/dialog-data.component';
import { DialogGitComponent } from '../dialog-git/dialog-git.component';

@Component({
  selector: 'app-grid-tags',
  templateUrl: './grid-tags.component.html',
  styleUrls: ['./grid-tags.component.css']
})
export class GridTagsComponent implements OnInit {

  gridOptions: GridOptions;
  columnDefs: any[];
  showRemove = false;

  dataItemEdited: TagDescriptor;

  @Input() rowData: any[];
  @Output() addClick: EventEmitter<ChildEvent> = new EventEmitter<ChildEvent>();
  @Output() editClick: EventEmitter<ChildEvent> = new EventEmitter<ChildEvent>();
  @Output() removeClick: EventEmitter<ChildEvent> = new EventEmitter<ChildEvent>();
  @Output() linkFileClick: EventEmitter<ChildEvent> = new EventEmitter<ChildEvent>();

  constructor(private data: DataService, public dialog: MatDialog) {

    // Set up the grid
    this.gridOptions = <GridOptions>{
      enableSorting: true,
      enableColResize: true,
      rowSelection: 'single',
      rowDragManaged: true,
      overlayLoadingTemplate: '<span><div class="spinner"></div></span>'
    };

    // Set callback so rows can be found with the getRowNode function
    this.gridOptions.getRowNodeId = function (data) {
      return data.id;
    };

    // Grid columns
    this.columnDefs = [
      { headerName: 'Title', field: 'title', width: 230, rowDrag: true },
      { headerName: 'Facsimile page', field: 'publication_facsimile_page', width: 230 }
    ];

  }

  ngOnInit() {
  }

  onGridReady(params) {
    // Do something when grid has initialized
  }

  onRowDragEnd(event: any) {
    this.gridOptions.api.forEachNodeAfterFilterAndSort((node) => {
      const tag: TagDescriptor = { type: DataItemType.Tag, id: node.data.id, sort_order: node.childIndex + 1 };
      this.data.editTagOccurrence(this.data.projectName, tag).subscribe(
        data => { },
        err => { console.log(err); }
      );
    });
  }

  showLoadingOverlay() {
    this.gridOptions.api.showLoadingOverlay();
  }

  onAddClick() {
    // const doc: ChildEvent = {type: ChildEventType.Add};
    // this.addClick.emit(doc);
    const dataEmpty: DataItemDescriptor = { type: DataItemType.Tag };
    this.showDataDialog(dataEmpty);
  }

  onEditClick() {
    const selRows = this.gridOptions.api.getSelectedRows();
    if (selRows.length === 1) {
      const dataItem: DataItemDescriptor = {
        type: DataItemType.Tag,
        title: selRows[0].title,
        id: selRows[0].id,
        publication_facsimile_page: selRows[0].publication_facsimile_page,
        event_id: selRows[0].event_id
      };
      this.showDataDialog(dataItem);
    } else {
      alert('You need to select a row to edit!');
    }
  }

  // Remove clicked, not currently implemented
  onRemoveClick() {
    const selRows = this.gridOptions.api.getSelectedRows();
    if(selRows.length === 1) {
      this.deleteItem(selRows[0].id);
    }
  }

  showGitDialog() {
    const dialogRef = this.dialog.open(DialogGitComponent, {
      width: '700px',
      data: { name: '', path: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.name.length > 0) {
        // Get selected rows of grid
        const selRows = this.gridOptions.api.getSelectedRows();
        // Create a data item and set the path to the selected file
        const dataItem: DataItemDescriptor = {
          type: DataItemType.Tag,
          id: selRows[0].id,
          title: selRows[0].title,
          filename: result.path + '/' + result.name
        };
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
      if (result.id !== undefined) {
        // Keep track of edited item, this will be used if server request is successful
        this.dataItemEdited = result;
        // id is defined, means that an item has been edited
        if (result.id !== undefined) {
          this.editItem(result);
        }
      }// Id is not defined, add item
      else {
        this.addItem(result);
      }
    });
  }

  addItem(dataItem: DataItemDescriptor) {
    dataItem.sort_order = this.gridOptions.api.getDisplayedRowCount() + 1;
    if( this.data.publication !== undefined ) {
      dataItem['publication_id'] = this.data.publication;
    }
    this.data.addTagOccurrence(this.data.projectName, dataItem).subscribe(
      data => {
        // Set id from returned data
        this.dataItemEdited.id = data.id;
        // Add row
        this.addRow(data);
      },
      err => { console.log(err); }
    );
  }

  // Edit an item
  editItem(dataItem: DataItemDescriptor) {
    this.data.editTagOccurrence(this.data.projectName, dataItem).subscribe(
      data => {
        this.editRow(data);
      },
      err => { console.log(err); }
    );
  }

  // Edit an item
  deleteItem(id) {
    this.data.deleteTagOccurrence(this.data.projectName, id).subscribe(
      data => {
        this.editRow(data);
      },
      err => { console.log(err); }
    );
  }

  addRow(data: any) {
    // Create a grid row item from the project data
    const rowDataItem = this.createGridData(this.dataItemEdited);
    // Add the new project row to the grid
    this.gridOptions.api.updateRowData({ add: [rowDataItem] });
  }

  editRow(data: any) {
    // Get the row node with the id of the edited item
    const rowNode = this.gridOptions.api.getRowNode(this.dataItemEdited.id.toString());
    // Set the new item row data
    rowNode.setData(this.createGridData(this.dataItemEdited));
  }

  createGridData(dataItem: TagDescriptor): any {
    const newData = { 'title': dataItem['title'], 'id': dataItem.id, 'publication_facsimile_page': dataItem['publication_facsimile_page'] };
    return newData;
  }

}
