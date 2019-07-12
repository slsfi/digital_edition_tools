import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { GridOptions, RowNode } from 'ag-grid';
import { DataService, SubjectDescriptor, LocationDescriptor, DialogData } from '../../services/data.service';
import { DialogSubjectComponent } from '../dialog-subject/dialog-subject.component';
import { DialogLocationComponent } from '../dialog-location/dialog-location.component';
import { nbind } from 'q';

@Component({
  selector: 'app-editor-selector-tab',
  templateUrl: './editor-selector-tab.component.html',
  styleUrls: ['./editor-selector-tab.component.css']
})
export class EditorSelectorTabComponent implements OnInit {

  @Input() header: string;
  @Input() configuration: SelectorTabConfiguration;

  public filename = 'No file opened';

  // Grid for occurences
  occGridOptions: GridOptions;
  occColumnDefs: any[];
  occRowData: any[];

  // Grid for data (persons, places, etc.)
  datGridOptions: GridOptions;
  datColumnDefs: any[];
  datRowData: any[];
  datSeachStringTimeout: any = null;
  datSearchString = '';
  datSearchId = '';
  datRowFound = false;
  datFocusRow = -1;

  // XML Document Nodes
  xmlNodes: Element[] = [];
  xmlDoc: XMLDocument;

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
    this.occGridOptions.getRowStyle = function (params) {
      if (!params.node.data.saved) {
        return { color: 'blue' };
      } else if (params.node.data.id.length > 0) {
        return { color: 'green' };
      }
    };

    // Set columns for occurences grid
    this.occColumnDefs = [
      { headerName: 'Occurence', field: 'occurence' },
      { headerName: 'Paragraph', field: 'section' },
      { headerName: 'Id', field: 'id' },
      { headerName: 'Saved', field: 'saved', hide: true }
    ];

  }

  ngOnInit() {
    // Set column for data grid
    switch (this.configuration.type) {
      case 'subjects':
        this.datColumnDefs = [
          { headerName: 'Surname', field: 'last_name', sortingOrder: ['asc', 'desc'] },
          { headerName: 'First name', field: 'first_name' },
          { headerName: 'Full name', field: 'full_name' },
          { headerName: 'Description', field: 'description' },
          { headerName: 'Id', field: 'id' } // , hide: true
        ];
        break;

      case 'locations':
        this.datColumnDefs = [
          { headerName: 'Place', field: 'name', sortingOrder: ['asc', 'desc'] },
          { headerName: 'Description', field: 'description' },
          { headerName: 'Id', field: 'id' } // , hide: true
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
    switch (this.configuration.type) {
      case 'subjects':
        if (this.data.dataSubjects === undefined || forceRefresh) {
          this.data.getSubjects().subscribe(
            data => {
              this.data.dataSubjects = data;
              this.populate(data);
              this.datGridOptions.api.hideOverlay();
            },
            err => {
              this.datGridOptions.api.hideOverlay();
              console.log(err);
            }
          );
        } else {
          this.populate(this.data.dataSubjects);
          this.datGridOptions.api.hideOverlay();
        }
        break;

      case 'locations':
        if (this.data.dataLocations === undefined || forceRefresh) {
          this.data.getLocations().subscribe(
            data => {
              this.data.dataLocations = data;
              this.populate(data);
              this.datGridOptions.api.hideOverlay();
            },
            err => {
              this.datGridOptions.api.hideOverlay();
              console.log(err);
            }
          );
        } else {
          this.populate(this.data.dataLocations);
          this.datGridOptions.api.hideOverlay();
        }
        break;
    }
  }

  populate(data: any) {
    const tmpData = [];
    for (let i = 0; i < data.length; i++) {
      if ( this.data.projectId === data[i].project_id ) {
        tmpData.push(data[i]);
      }
    }
    this.datRowData = tmpData;
    // this.datRowData = data;
    this.sortData();
  }

  /*populateLocations(data: any) {
    const tmpData = [];
    for (let i = 0; i < data.length; i++) {
      tmpData.push({'name': data[i].name, 'id': data[i].id, 'description': data[i].description});
    }
    this.datRowData = tmpData;
    this.sortData();
  }*/

  occOnKeyDown(event: KeyboardEvent) {
    if (event.key.toLowerCase() === 'arrowup' || event.key.toLowerCase() === 'arrowdown') {
      this.occGridOptions.api.selectIndex(this.occGridOptions.api.getFocusedCell().rowIndex, false, false);
    }
  }

  datLoadOccurences(xmlDoc: XMLDocument) {

    this.xmlDoc = xmlDoc;

    // Clear the occurences grid and the xml node list
    this.occRowData = [];
    this.xmlNodes = [];

    // Get the nodes using XPath defined in configuration (environment)
    const xp: XPathResult = xmlDoc.evaluate(this.configuration.elementsXPath, xmlDoc.documentElement,
      null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

    // this.xmltest = this.xmlDoc.getElementsByTagName("p")[0].innerHTML;

    let node: Element = xp.iterateNext() as Element;
    while (node) {
      this.xmlNodes.push(node);
      node = xp.iterateNext() as Element;
    }

    this.xmlNodes.forEach(element => {
      let id = element.getAttribute(this.configuration.attribute);
      if (id === null) {
        id = '';
      }
      this.occRowData.push({
        occurence: element.textContent, section: element.parentElement.textContent.substring(0, 50),
        id: id, saved: true
      });
    });
  }

  showLoadingOverlay() {
    this.occGridOptions.api.showLoadingOverlay();
  }

  sortData() {
    const sort = [
      { colId: this.configuration.sortByField, sort: 'asc' }
    ];
    this.datGridOptions.api.setSortModel(sort);
  }

  datOnRefreshClick() {
    this.datGridOptions.api.showLoadingOverlay();
    this.refreshData(true);
  }

  datOnAddClick() {
    switch (this.configuration.type) {
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
    // Get selected row
    // const selRows = this.datGridOptions.api.getSelectedRows();
    const _rowIndex = this.datGridOptions.api.getFocusedCell().rowIndex;
    const selectedNode = this.datGridOptions.api.getDisplayedRowAtIndex(_rowIndex);

    // Check that (only) one row is selected
    // if (selRows.length === 1) {
    switch (this.configuration.type) {
      case 'subjects':
        // console.log(selectedNode);
        const subject: SubjectDescriptor = selectedNode.data as SubjectDescriptor;
        this.showDataDialog(subject);
        break;

      case 'locations':
        // console.log(selectedNode);
        const location: LocationDescriptor = selectedNode.data as LocationDescriptor;
        this.showDataDialog(location);
        break;
    }
    /*const dataItem: DataItemDescriptor = {type: this.listLevel, id: selRows[0].id,
      title: selRows[0].title, date: selRows[0].date, published: selRows[0].published, genre: selRows[0].genre};
    this.showDataDialog(dataItem);*/
    // } else {
    //  alert('You need to select (only) one row to edit!');
    // }
  }

  datOnKeyDown(event: KeyboardEvent) {
    // Check for printable character (excluding space)
    if (event.key.length === 1 && event.key !== ' ') {
      // Add letter/symbol to search string
      this.datSearchString += event.key.toLowerCase();
      // Set datRowFound to false to enable search
      this.datRowFound = false;
      // Select first node with search criteria
      this.datGridOptions.api.forEachNodeAfterFilterAndSort((node) => {
        // Skip if row with criteria has already been found
        if (!this.datRowFound) {
          if (node.data[this.configuration.sortByField] !== null &&
            node.data[this.configuration.sortByField].toLowerCase().startsWith(this.datSearchString)) {
            // Select and show node
            this.datGotoNode(node, true, false);
          }
        }
      });
      // Clear previous timeout
      clearTimeout(this.datSeachStringTimeout);
      // Clear search string after a second
      this.datSeachStringTimeout = setTimeout(() => {
        this.datSearchString = '';
      }, 1000);
    } else if (event.key.toLowerCase() === 'enter') {
      this.datSetId();
    }
  }

  showDataDialog(dataItem: any) {
    let dialogType = DialogSubjectComponent;
    if (this.configuration.type === 'locations') {
      dialogType = DialogLocationComponent;
    }
    // Show the dialog
    const dialogRef = this.dialog.open(dialogType, {
      width: '700px',
      data: dataItem
    });
    // Subscribe to dialog closed event
    dialogRef.afterClosed().subscribe(result => {
      // If title is undefined, then user cancelled the dialog
      if (result.success === true) {
        // Keep track of edited item, this will be used if server request is successful
        // this.dataItemEdited = result;
        // id is defined, means that an item has been edited
        if (result.data.id !== undefined) {
          this.editItem(result);
        } else {
          this.addItem(result);
        }
      }
    });
  }

  addItem(dialogData: DialogData) {
    switch (this.configuration.type) {
      case 'subjects':
        const subject: SubjectDescriptor = dialogData.data as SubjectDescriptor;
        this.data.addSubject(this.data.projectName, subject).subscribe(
          data => {
            this.datGridOptions.api.updateRowData({ add: [data.row] });
          },
          err => { console.log(err); }
        );
        break;

      case 'locations':
        const location: LocationDescriptor = dialogData.data as LocationDescriptor;
        this.data.addLocation(this.data.projectName, location).subscribe(
          data => {
            this.datGridOptions.api.updateRowData({ add: [data.row] });
          },
          err => { console.log(err); }
        );
        break;
    }
  }

  editItem(dialogData: DialogData) {
    switch (this.configuration.type) {
      case 'subjects':
        const subject: SubjectDescriptor = dialogData.data as SubjectDescriptor;
        this.data.editSubject(this.data.projectName, subject).subscribe(
          data => {
            const rowNode = this.datGridOptions.api.getRowNode(data.row.id);
            rowNode.setData(data.row);
          },
          err => { console.log(err); }
        );
        break;

      case 'locations':
        const location: LocationDescriptor = dialogData.data as LocationDescriptor;
        this.data.editLocation(this.data.projectName, location).subscribe(
          data => {
            const rowNode = this.datGridOptions.api.getRowNode(data.row.id);
            rowNode.setData(data.row);
          },
          err => { console.log(err); }
        );
        break;
    }
  }

  datSetId() {
    // Check if a row is selected in the occurences grid
    if (this.occGridOptions.api.getSelectedRows().length > 0) {
      // Select current row of data grid and get it's id
      const _rowIndex = this.datGridOptions.api.getFocusedCell().rowIndex;
      let n = this.datGridOptions.api.getDisplayedRowAtIndex(_rowIndex);
      n.setSelected(true);
      // this.datGridOptions.api.selectIndex(_rowIndex, false, false);
      const rowSource = this.datGridOptions.api.getSelectedRows()[0];
      // Get selected row/node of occurences grid
      const rowDest = this.occGridOptions.api.getSelectedRows()[0];
      const rowDestNode = this.occGridOptions.api.getSelectedNodes()[0];
      // Copy id from data to occurences
      rowDest.id = rowSource.id.toString();
      // Set saved to false for row (changes colour of the row with callback)
      rowDest.saved = false;
      // Set id of xml element
      this.xmlNodes[rowDestNode.childIndex].setAttribute(this.configuration.attribute, rowSource.id);
      // Refresh occurences grid
      this.occGridOptions.api.redrawRows();
      // Select next occurence
      if (rowDestNode.childIndex < this.occGridOptions.api.getDisplayedRowCount() - 1) {
        n = this.occGridOptions.api.getDisplayedRowAtIndex(rowDestNode.childIndex + 1);
        n.setSelected(true);
        this.occGridOptions.api.ensureIndexVisible(rowDestNode.childIndex + 1, 'middle');
      }
    }
  }

  occOnSelectionChanged(event: any) {
    const node = this.occGridOptions.api.getSelectedNodes()[0];
    console.log(node);
    if (node.data.id.length > 0) {
      // Set id to search for in data grid
      this.datSearchId = node.data.id;
      // Update text box to show paragraph
      const _rowIndex = node.rowIndex;
      this.textParagraph = this.xmlNodes[_rowIndex].parentElement.textContent;
      // Enable searching
      this.datRowFound = false;
      // Select node with id in data grid
      this.datGridOptions.api.forEachNode((n) => {
        // Skip if row with criteria has already been found
        if (!this.datRowFound) {
          if (n.data.id === this.datSearchId) {
            // Select and show rowNode in data grid
            this.datGotoNode(n, false, true);
          }
        }
      });
    } else {
      // Deselect all rows if id is empty
      this.datGridOptions.api.deselectAll();
    }
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
    if (select) {
      node.setSelected(true);
    }
    // For some reason, focus is lost if we set focused cell directly after ensureIndexVisible, we need to use a timeout instead
    if (focus) {
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
  name: string;
  type: string;
  descriptionField: string;
  sortByColumn: number;
  sortByField: string;
  elements: string[];
  elementsXPath: string;
  attribute: string;
}
