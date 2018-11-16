import { Component, OnInit, Input } from '@angular/core';
import { GridOptions, RowNode } from 'ag-grid';

@Component({
  selector: 'app-grid-texts',
  templateUrl: './grid-texts.component.html',
  styleUrls: ['./grid-texts.component.css']
})
export class GridTextsComponent implements OnInit {

  gridOptions: GridOptions;
  columnDefs: any[];

  @Input() rowData: any[];

  constructor() { 

    // Set up the grid
    this.gridOptions = <GridOptions>{
      enableSorting: false,
      rowSelection: 'single'
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

}
