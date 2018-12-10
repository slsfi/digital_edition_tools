import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { GridOptions } from 'ag-grid';
import { DataService, FacsimileCollectionDescriptor, FacsimileDescriptor } from "../../services/data.service";
import { DialogFacsimileCollectionComponent } from '../dialog-facsimile-collection/dialog-facsimile-collection.component';
import { DialogFacsimileComponent } from '../dialog-facsimile/dialog-facsimile.component';

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

  facsimileCollectionEdited: FacsimileCollectionDescriptor;
  facsimileEdited: FacsimileDescriptor;

  rowDataFC: any = [];
  rowDataF: any = [];
  //@Output() addClick: EventEmitter<ChildEvent> = new EventEmitter<ChildEvent>();

  constructor(private data: DataService, public dialog: MatDialog) { 

    // Set up the facsimile grids
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
      {headerName: 'Description', field: 'description', hide: true},
      {headerName: 'Id', field: 'id', hide: true},
      {headerName: 'Pages', field: 'pages', width: 100},
      {headerName: 'First page', field: 'firstPage', width: 100},
      {headerName: 'Path', field: 'path', hide: true},
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

  // Facsimile collection grid ready
  onFCGridReady(params) {
    // Fill the facsimile collection grid
    this.getFacsimileCollections(false);
  }

  // Refresh button click (facsimile collections)
  onFCRefreshClick() {
    // Fill the facsimile collection grid
    this.getFacsimileCollections(true);
  }

  // Get all facsimile collections from the server and fill the facsimile collection grid
  getFacsimileCollections(forceRefresh: boolean) {
    // Show the spinning wheel of the grid
    this.gridOptionsFC.api.showLoadingOverlay();
    // Check if no data is cached or if should force refresh (refresh button clicked)
    if(this.data.dataFacsimileCollections === undefined || forceRefresh) {
      // Send the request
      this.data.getFacsimileCollections(this.data.projectName).subscribe(
        data => {
          // Cache the fetched data
          this.data.dataFacsimileCollections = data;
          // Fill the grid
          this.populateFacsimileCollections(data);
        },
        err => { console.info(err); }
      );
    }
    // Fill the facsimile collection grid from cached data
    else
      this.populateFacsimileCollections(this.data.dataFacsimileCollections);
  }

  populateFacsimileCollections(data: any) {
    let fcData = [];
    for (var i = 0; i < data.length; i++) {
      fcData.push( {'title': data[i].title, 'description': data[i].description, 'id': data[i].id, 'pages': data[i].number_of_pages, 'firstPage': data[i].start_page_number, 'path': data[i].folder_path} );
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

  onFCAddClick() {
    // Open an edit dialog with empty data
    const dataEmpty: FacsimileCollectionDescriptor = {};
    this.showFacsimileCollectionDialog(dataEmpty);
  }

  onFCEditClick() {
    // Get selected rows
    const selRows = this.gridOptionsFC.api.getSelectedRows();
    // Check that (only) one row is selected
    if(selRows.length == 1) {
      const dataItem: FacsimileCollectionDescriptor = {id: selRows[0].id, title: selRows[0].title, description: selRows[0].description, numberOfPages: selRows[0].pages, startPageNumber: selRows[0].firstPage, folderPath: selRows[0].path};
      this.showFacsimileCollectionDialog(dataItem);
    }
    else
      alert('You need to select (only) one row to edit!');
  }
  
  onFCRemoveClick() {
    const rowSelection = this.gridOptionsFC.api.getSelectedRows();
    if(rowSelection.length == 1) {
    }
  }

  showFacsimileCollectionDialog(dataItem: FacsimileCollectionDescriptor) {
    // Show the dialog
    const dialogRef = this.dialog.open(DialogFacsimileCollectionComponent, {
      width: '700px',
      data: dataItem
    });
    // Subscribe to dialog closed event
    dialogRef.afterClosed().subscribe(result => {
      // If title is undefined, then user cancelled the dialog
      if(result.title !== undefined) { 
        // Keep track of edited item, this will be used if server request is successful
        this.facsimileCollectionEdited = result;
        // id is defined, means that an item has been edited
        if(result.id !== undefined)
          this.editFC(result);
        // Id is not defined, add item
        else
          this.addFC(result);
      }
    });
  }

  addFC(dataItem: FacsimileCollectionDescriptor) {
    this.data.addFacsimileCollection(this.data.projectName, dataItem).subscribe(
      data => {
        // Set id from returned data
        this.facsimileCollectionEdited.id = data.row.id;
        // Add row
        this.addRowFC(this.facsimileCollectionEdited);
      },
      err => { console.info(err); }
    );
  }
  
  editFC(dataItem: FacsimileCollectionDescriptor) {
    this.data.editFacsimileCollection(this.data.projectName, dataItem).subscribe(
      data => {
        // Edit grid row
        this.editRowFC(this.facsimileCollectionEdited);
      },
      err => { console.info(err); }
    );
  }

  addRowFC(dataItem: FacsimileCollectionDescriptor) {
    // Create a grid row item from the project data
    const rowDataItem = this.createFCGridData(dataItem);
    // Add the new project row to the grid
    this.gridOptionsFC.api.updateRowData({add: [rowDataItem]});
  }

  editRowFC(dataItem: FacsimileCollectionDescriptor) {
    // Get the row node with the id of the edited item
    let rowNode = this.gridOptionsFC.api.getRowNode(this.facsimileCollectionEdited.id.toString());
    // Set the new item row data
    rowNode.setData(this.createFCGridData(this.facsimileCollectionEdited));
  }

  // Create facsimile collection grid data row
  createFCGridData(dataItem: FacsimileCollectionDescriptor) {
    const newData: any = {'id': dataItem.id, 'title': dataItem.title, 'description': dataItem.description, 'pages': dataItem.numberOfPages, 'firstPage': dataItem.startPageNumber, 'path': dataItem.folderPath};
    return newData;
  }





}