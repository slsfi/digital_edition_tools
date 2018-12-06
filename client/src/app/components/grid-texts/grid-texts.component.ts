import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridOptions, RowNode } from 'ag-grid';
import { ChildEvent, ChildEventType } from '../../services/data.service';

@Component({
  selector: 'app-grid-texts',
  templateUrl: './grid-texts.component.html',
  styleUrls: ['./grid-texts.component.css']
})
export class GridTextsComponent implements OnInit {

  gridOptions: GridOptions;
  columnDefs: any[];
  showRemove: boolean = false;

  @Input() rowData: any[];
  @Output() addClick: EventEmitter<ChildEvent> = new EventEmitter<ChildEvent>();
  @Output() editClick: EventEmitter<ChildEvent> = new EventEmitter<ChildEvent>();
  @Output() removeClick: EventEmitter<ChildEvent> = new EventEmitter<ChildEvent>();
  @Output() linkFileClick: EventEmitter<ChildEvent> = new EventEmitter<ChildEvent>();

  constructor() { 

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
    const doc: ChildEvent = {type: ChildEventType.Add};
    this.addClick.emit(doc);
  }

  onEditClick() {
    const rowSelection = this.gridOptions.api.getSelectedRows();
    if(rowSelection.length == 1) {
      const doc: ChildEvent = {type: ChildEventType.Edit};
      this.editClick.emit(doc);
    }
  }
  
  onRemoveClick() {
    const rowSelection = this.gridOptions.api.getSelectedRows();
    if(rowSelection.length == 1) {
      const doc: ChildEvent = {type: ChildEventType.Remove};
      this.removeClick.emit(doc);
    }
  }

  onLinkFileClick() {
    const rowSelection = this.gridOptions.api.getSelectedRows();
    if(rowSelection.length == 1) {
      const doc: ChildEvent = {type: ChildEventType.LinkFile};
      this.linkFileClick.emit(doc);
    }
  }

}