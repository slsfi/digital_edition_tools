import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { GridOptions, RowNode } from 'ag-grid';
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
  seachStringTimeoutFC: any = null;
  searchStringFC: string = "";
  rowFoundFC: boolean = false;
  focusRowFC: number = -1;


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

  // Component initialized
  ngOnInit() {
  }

  // ---------------------------------------
  // Facsimile collections
  // ---------------------------------------

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

  // Add facsimile collection button clicked
  onFCAddClick() {
    // Open an facsimile collection dialog with empty data
    const dataEmpty: FacsimileCollectionDescriptor = {};
    this.showFacsimileCollectionDialog(dataEmpty);
  }

  // Edit facsimile collection button clicked
  onFCEditClick() {
    // Get selected rows of facsimile collection grid
    const selRows = this.gridOptionsFC.api.getSelectedRows();
    // Check that (only) one row is selected
    if(selRows.length == 1) {
      // Create a FacsimileCollectionDescriptor item from the row data
      const dataItem: FacsimileCollectionDescriptor = {id: selRows[0].id, title: selRows[0].title, description: selRows[0].description, numberOfPages: selRows[0].pages, startPageNumber: selRows[0].firstPage, folderPath: selRows[0].path};
      // Show the dialog
      this.showFacsimileCollectionDialog(dataItem);
    }
    else
      alert('You need to select (only) one row to edit!');
  }
  
  // Remove facsimile collection button clicked (not implemented)
  onFCRemoveClick() {
    const rowSelection = this.gridOptionsFC.api.getSelectedRows();
    if(rowSelection.length == 1) {
    }
  }

  // Key pressed when facsimile collections grid is in focus
  onFCKeyDown(event: KeyboardEvent) {
    // Check for printable character (excluding space)
    if(event.key.length === 1 && event.key !== ' ') {
      // Add letter/symbol to search string
      this.searchStringFC += event.key.toLowerCase();
      // Set datRowFound to false to enable search
      this.rowFoundFC = false;
      // Select first node with search criteria
      this.gridOptionsFC.api.forEachNodeAfterFilterAndSort( (node) => {
        // Skip if row with criteria has already been found
        if(!this.rowFoundFC) {
          if(node.data.title !== null && node.data.title.toLowerCase().startsWith(this.searchStringFC) ) {
            // Select and show node
            this.gotoNodeFC(node, true, false);
          }
        }
      });
      // Clear previous timeout
      clearTimeout(this.seachStringTimeoutFC);
      // Clear search string after a second
      this.seachStringTimeoutFC = setTimeout(() => {
        this.searchStringFC="";
      }, 1000);
    }
  }

  gotoNodeFC(node: RowNode, focus: boolean, select: boolean) {
    // Ensure row is visible
    this.gridOptionsFC.api.ensureIndexVisible(node.rowIndex, 'middle');
    // Select row
    if(select)
      node.setSelected(true);
    // For some reason, focus is lost if we set focused cell directly after ensureIndexVisible, we need to use a timeout instead
    if(focus) {
      this.focusRowFC = node.rowIndex;
      setTimeout(() => {
        this.gridOptionsFC.api.setFocusedCell(this.focusRowFC, this.columnDefsFC[0].field);
      }, 50);
    }
    // "Hack" to quit searching after first row with criteria is found, there is no functionality to exit forEachNode prematurely.
    this.rowFoundFC = true;
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
          // Sort the data
          this.sortFacsimileCollectionGrid();
        },
        err => { console.info(err); }
      );
    }
    // Fill the facsimile collection grid from cached data
    else
      this.populateFacsimileCollections(this.data.dataFacsimileCollections);
  }

  // Fill the facsimile collection grid with data from server
  populateFacsimileCollections(data: any) {
    // Iterate all rows and create grid data rows
    let fcData = [];
    for (var i = 0; i < data.length; i++) {
      fcData.push( {'title': data[i].title, 'description': data[i].description, 'id': data[i].id, 'pages': data[i].number_of_pages, 'firstPage': data[i].start_page_number, 'path': data[i].folder_path} );
    }
    // Set the new grid data
    this.rowDataFC = fcData;
  }

  // Sort the facsimile collections grid alphabetically
  sortFacsimileCollectionGrid() {
    var sort = [
      {colId: 'title', sort: 'asc'}
    ];
    this.gridOptionsFC.api.setSortModel(sort);
  }

  // Show facsimile collection dialog (called when add / edit is clicked)
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
        // Store edited item, this will be used if server request is successful
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

  // Add a facsimile collection (called when facsimile collection dialog is closed)
  addFC(dataItem: FacsimileCollectionDescriptor) {
    // Send request to the server
    this.data.addFacsimileCollection(this.data.projectName, dataItem).subscribe(
      data => {
        // Set id of edited data from returned data
        this.facsimileCollectionEdited.id = data.row.id;
        // Create a grid row item from the project data
        const rowDataItem = this.createFCGridData(this.facsimileCollectionEdited);
        // Add the new project row to the grid
        this.gridOptionsFC.api.updateRowData({add: [rowDataItem]});
      },
      err => { console.info(err); }
    );
  }
  
  // Edit a facsimile collection (called when facsimile collection dialog is closed)
  editFC(dataItem: FacsimileCollectionDescriptor) {
    // Send the request to the server
    this.data.editFacsimileCollection(this.data.projectName, dataItem).subscribe(
      data => {
        // Get the row node with the id of the edited item
        const rowNode = this.gridOptionsFC.api.getRowNode(this.facsimileCollectionEdited.id.toString());
        // Set the new item row data
        rowNode.setData(this.createFCGridData(this.facsimileCollectionEdited));
      },
      err => { console.info(err); }
    );
  }

  // Create facsimile collection grid data row (when row added or edited)
  createFCGridData(dataItem: FacsimileCollectionDescriptor) {
    const newData: any = {'id': dataItem.id, 'title': dataItem.title, 'description': dataItem.description, 'pages': dataItem.numberOfPages, 'firstPage': dataItem.startPageNumber, 'path': dataItem.folderPath};
    return newData;
  }

  // ---------------------------------------
  // Facsimiles
  // ---------------------------------------

  // Add facsimile button clicked
  onFAddClick() {
    // Get selected rows of facsimile collection grid
    const selRows = this.gridOptionsFC.api.getSelectedRows();
    // Check that (only) one row is selected
    if(selRows.length == 1) {
      // Open an facsimil dialog with empty data
      const dataEmpty: FacsimileDescriptor = {title: selRows[0].title};
      this.showFacsimileDialog(dataEmpty);
    }
  }

  // Edit facsimile button clicked
  onFEditClick() {
    // Get selected rows of facsimile grid
    const selRows = this.gridOptionsF.api.getSelectedRows();
    // Check that (only) one row is selected
    if(selRows.length == 1) {
      // Create a FacsimileDescriptor item from the row data
      const dataItem: FacsimileDescriptor = {id: selRows[0].id, facsimileCollectionId: selRows[0].collectionId, title: selRows[0].title, page: selRows[0].page};
      // Show the dialog
      this.showFacsimileDialog(dataItem);
    }
    else
      alert('You need to select (only) one row to edit!');
  }

  // Show facsimile dialog (called when add / edit is clicked)
  showFacsimileDialog(dataItem: FacsimileDescriptor) {
    // Show the dialog
    const dialogRef = this.dialog.open(DialogFacsimileComponent, {
      width: '700px',
      data: dataItem
    });
    // Subscribe to dialog closed event
    dialogRef.afterClosed().subscribe(result => {
      // If page is undefined, then user cancelled the dialog
      if(result.page !== undefined) { 
        // Store edited item, this will be used if server request is successful
        this.facsimileEdited = result;
        // id is defined, means that an item has been edited
        if(result.id !== undefined) {
          this.editF(result);
        }
        // Id is not defined, add item
        else {
          this.addF(result);
        }
      }
    });
  }

  // Add a facsimile (called when facsimile dialog is closed)
  addF(dataItem: FacsimileDescriptor) {
    // Send request to the server
    this.data.linkFacsimile(this.data.projectName, this.data.publication, dataItem).subscribe(
      data => {
        // Set id of edited data from returned data
        this.facsimileEdited.id = data.row.id;
        // Create a grid row item from the project data
        const rowDataItem = this.createFGridData(this.facsimileEdited);
        // Add the new row to the grid
        this.gridOptionsF.api.updateRowData({add: [rowDataItem]});
      },
      err => { console.info(err); }
    );
  }
  
  // Edit a facsimile (called when facsimile dialog is closed)
  editF(dataItem: FacsimileDescriptor) {
    // Send the request to the server
    this.data.linkFacsimile(this.data.projectName, this.data.publication, dataItem).subscribe(
      data => {
        // Get the row node with the id of the edited item
        const rowNode = this.gridOptionsF.api.getRowNode(this.facsimileEdited.id.toString());
        // Set the new item row data
        rowNode.setData(this.createFGridData(this.facsimileEdited));
      },
      err => { console.info(err); }
    );
  }

  // Create facsimile grid data row (when row added or edited)
  createFGridData(dataItem: FacsimileDescriptor) {
    const newData: any = {'id': dataItem.id, 'title': dataItem.title, 'page': dataItem.page, 'collectionId': dataItem.facsimileCollectionId};
    return newData;
  }

  // Get all facsimiles for a given publication
  getFacsimiles() {
    // Show the spinning wheel over the grid
    this.gridOptionsF.api.showLoadingOverlay();
    // Send the request
    this.data.getFacsimiles(this.data.projectName, this.data.publication).subscribe(
      data => {
        // Iterate all rows and create grid data rows
        let fData = [];
        for (var i = 0; i < data.length; i++) {
          fData.push( {'title': data[i].title, 'id': data[i].id, 'collectionId': data[i].publication_facsimile_collection_id, 'page': data[i].page_nr} );
        }
        // Set the new grid data
        this.rowDataF = fData;
      },
      err => { console.info(err); }
    );
  }


}