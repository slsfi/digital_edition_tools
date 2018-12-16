import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { GridOptions, RowNode } from "ag-grid";
import { DataService, SubjectDescriptor, LocationDescriptor } from '../../services/data.service';
import { DialogSubjectComponent } from '../dialog-subject/dialog-subject.component';
import { DialogLocationComponent } from '../dialog-location/dialog-location.component';

@Component({
  selector: 'app-tool-selector-tab',
  templateUrl: './tool-selector-tab.component.html',
  styleUrls: ['./tool-selector-tab.component.css']
})
export class ToolSelectorTabComponent implements OnInit {

  @Input() header: string;
  @Input() configuration: SelectorTabConfiguration;

  public fileName: string = "No file opened";

  // Grid for occurences
  occGridOptions: GridOptions;
  occColumnDefs: any[]
  occRowData: any[];

  // Grid for data (persons, places, etc.)
  datGridOptions: GridOptions;
  datColumnDefs: any[]
  datRowData: any[];
  datSeachStringTimeout: any = null;
  datSearchString: string = "";
  datSearchId: string = "";
  datRowFound: boolean = false;
  datFocusRow: number = -1;

  // XML Document Nodes
  xmlNodes: Element[] = [];

  textParagraph: string;
  textDescription: string;

  constructor(private data: DataService, public dialog: MatDialog) {
    // Set up the grids 
    this.occGridOptions = <GridOptions>{
      enableColResize: true,
      enableSorting: false,
      rowSelection: 'single',
      overlayLoadingTemplate: '<span><div class="spinner"></div></span>',
      overlayNoRowsTemplate: '<span>No occurences to show</span>'
    };
    this.datGridOptions = <GridOptions>{
      enableColResize: true,
      enableSorting: true,
      rowSelection: 'single',
      suppressRowClickSelection: true,
      suppressFocusAfterRefresh: false,
      overlayLoadingTemplate: '<span><div class="spinner"></div></span>'
    };

    // Set row style callback functions
    this.occGridOptions.getRowStyle = function(params) {
      if(!params.node.data.saved)
        return { color: 'blue' };
      else if(params.node.data.id.length > 0) {
        return { color: 'green' };
      }
    }

    // Set columns for occurences grid
    this.occColumnDefs = [
      {headerName: 'Occurence', field: 'occurence'},
      {headerName: 'Paragraph', field: 'section'},
      {headerName: 'Id', field: 'id'},
      {headerName: 'Saved', field: 'saved', hide: true}
    ];

  }

  ngOnInit() {
    // Set column for data grid
    switch(this.configuration.type) 
    {
      case 'subjects':
        this.datColumnDefs = [
          {headerName: 'Surname', field: 'name', sortingOrder: ['asc','desc']},
          {headerName: 'First name', field: 'firstName'},
          {headerName: 'Description', field: 'description'},
          {headerName: 'Id', field: 'id'} // , hide: true
        ];
        break;

      case 'locations':
        this.datColumnDefs = [
          {headerName: 'Place', field: 'name', sortingOrder: ['asc','desc']},
          {headerName: 'Description', field: 'description'},
          {headerName: 'Id', field: 'id'} // , hide: true
        ];
        break;
    }
  }

  occOnGridReady(event: any) {
    this.occGridOptions.api.showNoRowsOverlay();
  }

  datOnGridReady(event: any) {
    this.refreshData(false);
  }

  refreshData(forceRefresh: boolean) {
    switch(this.configuration.type) 
    {
      case 'subjects':
        if(this.data.dataSubjects === undefined || forceRefresh) {
          this.data.getSubjects().subscribe(
            data => {
              this.data.dataSubjects = data;
              this.poulateSubjects(data);
            },
            err => { console.info(err); }
          );
        }
        else {
          this.poulateSubjects(this.data.dataSubjects);
        }
        break;

      case 'locations':
        if(this.data.dataLocations === undefined || forceRefresh) {
          this.data.getLocations().subscribe(
            data => {
              this.data.dataLocations = data;
              this.populateLocations(data);
            },
            err => { console.info(err); }
          );
        }
        else {
          this.populateLocations(this.data.dataLocations);
        }
        break;
    }
  }

  poulateSubjects(data: any) {
    var tmpData = [];
    for(var i=0; i<data.length; i++) {
      tmpData.push({'name': data[i].last_name, 'firstName': data[i].first_name, 'id': data[i].id, 'description': data[i].description});
    }
    this.datRowData = tmpData;
    this.sortData();
  }

  populateLocations(data: any) {
    var tmpData = [];
    for(var i=0; i<data.length; i++) {
      tmpData.push({'name': data[i].name, 'id': data[i].id, 'description': data[i].description});
    }
    this.datRowData = tmpData;
    this.sortData();
  }

  occOnKeyDown(event: KeyboardEvent) {
    if(event.key.toLowerCase() === 'arrowup' || event.key.toLowerCase() === 'arrowdown') {
      this.occGridOptions.api.selectIndex(this.occGridOptions.api.getFocusedCell().rowIndex, false, false);
    }
  }

  datLoadOccurences(xmlDoc: XMLDocument) {
    // Clear the occurences grid and the xml node list
    this.occRowData = [];
    this.xmlNodes = [];

    // Get the nodes using XPath defined in configuration (environment)
    let xp : XPathResult = xmlDoc.evaluate(this.configuration.elementsXPath, xmlDoc.documentElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

    //this.xmltest = this.xmlDoc.getElementsByTagName("p")[0].innerHTML;
    
    let node: Element = xp.iterateNext() as Element;
    while (node) {
      this.xmlNodes.push(node);
      node = xp.iterateNext() as Element;
    }

    this.xmlNodes.forEach(element => {
      let id = element.getAttribute(this.configuration.attribute);
      if(id === null)
        id = "";
      this.occRowData.push({occurence: element.textContent, section: element.parentElement.textContent.substring(0, 50), id: id, saved: true});
    });
  }

  showLoadingOverlay() {
    this.occGridOptions.api.showLoadingOverlay();
  }

  sortData() {
    var sort = [
      {colId: 'name', sort: 'asc'}
    ];
    this.datGridOptions.api.setSortModel(sort);
  }

  datOnRefreshClick() {
    this.refreshData(true);
  }

  datOnAddClick() {
    switch(this.configuration.type) 
    {
      case 'subjects':
        const subjectEmpty: SubjectDescriptor = {};
        this.showDataDialog(subjectEmpty);
        break;

      case 'locations':
        const locationEmpty: LocationDescriptor = {};
        this.showDataDialog(locationEmpty);
        break;
    }

  }

  datOnEditClick() {
  }

  datOnKeyDown(event: KeyboardEvent) {
    // Check for printable character (excluding space)
    if(event.key.length === 1 && event.key !== ' ') {
      // Add letter/symbol to search string
      this.datSearchString += event.key.toLowerCase();
      // Set datRowFound to false to enable search
      this.datRowFound = false;
      // Select first node with search criteria
      this.datGridOptions.api.forEachNodeAfterFilterAndSort( (node) => {
        // Skip if row with criteria has already been found
        if(!this.datRowFound) {
          if(node.data.name !== null && node.data.name.toLowerCase().startsWith(this.datSearchString) ) {
            // Select and show node
            this.datGotoNode(node, true, false);
          }
        }
      });
      // Clear previous timeout
      clearTimeout(this.datSeachStringTimeout);
      // Clear search string after a second
      this.datSeachStringTimeout = setTimeout(() => {
        this.datSearchString="";
      }, 1000);
    }
    else if(event.key.toLowerCase() === 'enter') {
      this.datSetId();
    }
  }

  showDataDialog(dataItem: any) {
    let dialogType = DialogSubjectComponent;
    if(this.configuration.type == 'locations')
      dialogType = DialogLocationComponent;
    // Show the dialog
    const dialogRef = this.dialog.open(dialogType, {
      width: '700px',
      data: dataItem
    });
    // Subscribe to dialog closed event
    dialogRef.afterClosed().subscribe(result => {
      // If title is undefined, then user cancelled the dialog
      /*if(result.title !== undefined) { 
        // Keep track of edited item, this will be used if server request is successful
        this.dataItemEdited = result;
        // id is defined, means that an item has been edited
        if(result.id !== undefined)
          this.editItem(result);
        // Id is not defined, add item
        else
          this.addItem(result);
      }*/
    });
  }



  datSetId() {
    // Check if a row is selected in the occurences grid
    if(this.occGridOptions.api.getSelectedRows().length > 0) {
      // Select current row of data grid and get it's id
      const _rowIndex = this.datGridOptions.api.getFocusedCell().rowIndex;
      this.datGridOptions.api.selectIndex(_rowIndex, false, false);
      const rowSource = this.datGridOptions.api.getSelectedRows()[0];
      // Get selected row of occurences grid
      let rowDest = this.occGridOptions.api.getSelectedRows()[0];
      // Get row index of selected row in occurences grid
      const _rowIndexDest = this.occGridOptions.api.getFocusedCell().rowIndex;
      // Copy id from data to occurences
      rowDest.id = rowSource.id;
      // Set saved to false for row (changes colour of the row with callback)
      rowDest.saved = false;
      // Set id of xml element
      this.xmlNodes[_rowIndexDest].setAttribute(this.configuration.attribute, rowSource.id);
      // Refresh occurences grid
      this.occGridOptions.api.redrawRows();
      // Select next occurence
      let rowNode = this.occGridOptions.api.getSelectedNodes()[0];
      if(rowNode.childIndex < this.occGridOptions.api.getDisplayedRowCount()-1) {
        this.occGridOptions.api.selectIndex(rowNode.childIndex+1, false, false);
        this.occGridOptions.api.ensureIndexVisible(rowNode.childIndex+1, 'middle');
      }
    }
  }

  occOnSelectionChanged(event: any) {
    let node = this.occGridOptions.api.getSelectedNodes()[0];
    if(node.data.id.length > 0) {
      // Set id to search for in data grid
      this.datSearchId = node.data.id;
      // Update text box to show paragraph
      const _rowIndex = node.rowIndex;
      this.textParagraph = this.xmlNodes[_rowIndex].parentElement.textContent;
      // Enable searching
      this.datRowFound = false;
      // Select node with id in data grid
      this.datGridOptions.api.forEachNode( (node) => {
        // Skip if row with criteria has already been found
        if(!this.datRowFound) {
          if (node.data.id === this.datSearchId) {
            // Select and show rowNode in data grid
            this.datGotoNode(node, false, true);
          }
        }
      });
    }
    else
      // Deselect all rows if id is empty
      this.datGridOptions.api.deselectAll();
  }

  // Show info for data row
  datOnCellClicked(event: any) {
    this.textDescription = event.data.description;
  }

  // Go to a node in the data grid (select and set to be in view)
  datGotoNode(node: RowNode, focus: boolean, select: boolean) {
    // Ensure row is visible
    this.datGridOptions.api.ensureIndexVisible(node.rowIndex, 'middle');
    // Select row
    if(select)
      node.setSelected(true);
    // For some reason, focus is lost if we set focused cell directly after ensureIndexVisible, we need to use a timeout instead
    if(focus) {
      this.datFocusRow = node.rowIndex;
      setTimeout(() => {
        this.datGridOptions.api.setFocusedCell(this.datFocusRow, this.datColumnDefs[0].field);
      }, 50);
    }
    // "Hack" to quit searching after first row with criteria is found, there is no functionality to exit forEachNode prematurely.
    this.datRowFound = true;
  }

  datOnCellDoubleClicked(event: any) {
    this.datSetId();
  }

}

interface SelectorTabConfiguration {
  name: string,
  type: string,
  descriptionField: string,
  sortByColumn: number,
  elements: string[],
  elementsXPath: string,
  attribute: string
}
