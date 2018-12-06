import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridOptions, RowNode } from 'ag-grid';
import { ChildEvent, ChildEventType } from '../../services/data.service';
import { DataItemDescriptor, DataItemType, DataService } from "../../services/data.service";

@Component({
  selector: 'app-grid-facsimiles',
  templateUrl: './grid-facsimiles.component.html',
  styleUrls: ['./grid-facsimiles.component.css']
})
export class GridFacsimilesComponent implements OnInit {

  gridOptionsFC: GridOptions;
  columnDefsFC: any[];
  gridOptionsF: GridOptions;
  columnDefsF: any[];
  showRemove: boolean = false;

  rowDataFC: any = [];
  rowDataF: any = [];
  //@Output() addClick: EventEmitter<ChildEvent> = new EventEmitter<ChildEvent>();

  constructor(private data: DataService) { 

    // Set up the grids
    this.gridOptionsFC = <GridOptions>{
      enableSorting: true,
      rowSelection: 'single',
      overlayLoadingTemplate: '<span><div class="spinner"></div></span>'
    };
    this.gridOptionsF = <GridOptions>{
      enableSorting: false,
      rowSelection: 'single',
      overlayLoadingTemplate: '<span><div class="spinner"></div></span>'
    };

    // Set callback so rows can be found with the getRowNode function
    this.gridOptionsFC.getRowNodeId = function(data) {
      return data.id;
    };
    this.gridOptionsF.getRowNodeId = function(data) {
      return data.id;
    };

    // Grid columns
    this.columnDefsFC = [
      {headerName: 'Title', field: 'title', width: 230},
      {headerName: 'Id', field: 'id', hide: true},
      {headerName: 'Pages', field: 'pages', width: 100},
      {headerName: 'First page', field: 'firstPage', width: 100}
    ];
    this.columnDefsF = [
      {headerName: 'Title', field: 'title', width: 230},
      {headerName: 'Id', field: 'id', hide: true},
      {headerName: 'CollectionId', field: 'collectionId', hide: true},
      {headerName: 'Page', field: 'page', width: 100}
    ];

  }

  ngOnInit() {
  }

  onFCGridReady(params) {
    this.getFacsimileCollections(false);
  }
  onFGridReady(params) {
    /*this.data.getFacsimiles(this.data.projectName, this.data.publication).subscribe(
      data => {
        console.info(data);
      },
      err => { console.info(err); }
    );*/
  }

  onFCRefreshClick() {
    this.getFacsimileCollections(true);
  }

  getFacsimileCollections(forceRefresh: boolean) {
    this.gridOptionsFC.api.showLoadingOverlay();
    if(this.data.dataFacsimileCollections === undefined || forceRefresh) {
      this.data.getFacsimileCollections(this.data.projectName).subscribe(
        data => {
          this.data.dataFacsimileCollections = data;
          this.populateFacsimileCollections(data);
        },
        err => { console.info(err); }
      );
    }
    else
      this.populateFacsimileCollections(this.data.dataFacsimileCollections);
  }

  populateFacsimileCollections(data: any) {
    let fcData = [];
    for (var i = 0; i < data.length; i++) {
      fcData.push( {'title': data[i].title, 'id': data[i].id, 'pages': data[i].number_of_pages, 'firstPage': data[i].start_page_number} );
    }
    this.rowDataFC = fcData;
  }

  getFacsimiles() {
    this.gridOptionsF.api.showLoadingOverlay();
    this.data.getFacsimiles(this.data.projectName, this.data.publication).subscribe(
      data => {
        let fData = [];
        for (var i = 0; i < data.length; i++) {
          fData.push( {'title': data[i].title, 'id': data[i].id, 'collectionId': data[i].publication_facsimile_collection_id, 'page': data[i].page_nr} );
        }
        this.rowDataF = fData;
      },
      err => { console.info(err); }
    );
  }

  onAddClick() {
  }

  onFCEditClick() {
    const rowSelection = this.gridOptionsFC.api.getSelectedRows();
    if(rowSelection.length == 1) {
    }
  }
  
  onFCRemoveClick() {
    const rowSelection = this.gridOptionsFC.api.getSelectedRows();
    if(rowSelection.length == 1) {
    }
  }

}