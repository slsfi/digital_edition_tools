import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {GridColumnStatusComponent} from '../grid-column-status/grid-column-status.component';
import { environment } from '../../../environments/environment.prod';
import { DataService } from '../../services/data.service';

import {GridOptions, RowNode} from 'ag-grid';
import { identifierName } from '@angular/compiler';

@Component({
  selector: 'app-grid-publications',
  templateUrl: './grid-publications.component.html'
})
export class GridPublicationsComponent implements OnInit {

  showRemove: boolean = environment.publisher_configuration.show_remove;
  listLevel: ListLevel = ListLevel.projects;

  gridOptions: GridOptions;
  columnDefs: any[];
  rowData: any[];

  @Output() listLevelChanged: EventEmitter<ListLevel> = new EventEmitter<ListLevel>();

  constructor(private data: DataService) {
    this.gridOptions = <GridOptions>{
      enableSorting: true,
      rowSelection: 'multiple'
    };

    this.gridOptions.getRowStyle = function(params) {
      if (params.node.data.flagPublished == 1)
        return { color: '#0d6e00' };
    };

    this.columnDefs = [
      {headerName: 'Title', field: 'title', width: 200, checkboxSelection: true},
      {headerName: 'Id', field: 'id', width: 70},
      {headerName: 'flagPublished', field: 'flagPublished', hide: true},
      {headerName: 'Published', field: 'published', width: 90}
    ];
    // {headerName: 'Published', field: 'published', width: 200, cellRendererFramework: GridColumnStatusComponent}

    /*this.rowData = [
      {title: 'Ljungblommor', id: '1', flag: 1, published: 'Not published'},
      {title: 'Brev', id: '15', flag: 0, published: 'Published'},
      {title: 'Finland framställt i teckningar', id: '14', flag: 1, published: 'Not published'}
    ];*/
  }
  ngOnInit() {
    this.listProjects();
  }

  onGridReady(params) {
    // params.api.sizeColumnsToFit();
  }

  onSelectionChanged(event: any) {

  }

  onRowClick(event: any) {

  }

  onRowDoubleClick(event: any) {
    switch(this.listLevel) {
      case ListLevel.projects:
        // Set active project
        this.data.projectName = event.data.title;
        // List all publication collections for the project
        this.listPublicationCollections(event.data.title);
        break;
      case ListLevel.publicationCollections:
        // Set active publication Collection
        this.data.publicationCollection = event.data.id;
        this.listPublications(this.data.projectName, event.data.id);
        break;
    }
  }

  listProjects() {
    this.data.getProjects().subscribe(
      data => {
        this.listLevel = ListLevel.projects;
        var tmpTreeData = [];
        for(var i=0; i<data.length; i++) {
          tmpTreeData.push({'title': data[i].name, 'id': data[i].id, 'flagPublished': data[i].published, 'published': (data[i].published ? 'Yes' : 'No')});
        }
        this.rowData = tmpTreeData;
        this.listLevelChanged.emit(this.listLevel);
      },
      err => {
        /*const tmpData = [
          {
            "id": 1,
            "project_id": 1,
            "publicationCollectionIntroduction_id": 4,
            "publicationCollectionTitle_id": 23,
            "published": true
          },
          {
            "id": 2,
            "project_id": 1,
            "publicationCollectionIntroduction_id": 6,
            "publicationCollectionTitle_id": 2,
            "published": true
          }
        ];
        var tmpTreeData = [];
        for(var i=0; i<tmpData.length; i++) {
          tmpTreeData.push({'title': tmpData[i].id.toString(), 'id': tmpData[i].id, 'flagPublished': tmpData[i].published, 'published': (tmpData[i].published ? 'Yes' : 'No')});
        }
        this.rowData = tmpTreeData;*/
      }
    );
  }

  listPublicationCollections(projectName: string) {
    this.data.getPublicationCollections(projectName).subscribe(
      data => {
        this.listLevel = ListLevel.publicationCollections;
        var tmpTreeData = [];
        for(var i=0; i<data.length; i++) {
          tmpTreeData.push({'title': data[i].name, 'id': data[i].id, 'flagPublished': data[i].published, 'published': (data[i].published ? 'Yes' : 'No')});
        }
        this.rowData = tmpTreeData;
        this.listLevelChanged.emit(this.listLevel);
      },
      err => {
        //this.showSpinner = false;
      }
    );
  }

  listPublications(projectName: string, id: number) {
    this.data.getPublications(projectName, id).subscribe(
      data => {
        this.listLevel = ListLevel.publications;
        var tmpTreeData = [];
        for(var i=0; i<data.length; i++) {
          tmpTreeData.push({'title': data[i].name, 'id': data[i].id, 'flagPublished': data[i].published, 'published': (data[i].published ? 'Yes' : 'No')});
        }
        this.rowData = tmpTreeData;
        this.listLevelChanged.emit(this.listLevel);
      },
      err => {
        //this.showSpinner = false;
      }
    );
  }

  selectAllRows() {
      this.gridOptions.api.selectAll();
  }

  deselectAllRows() {
    this.gridOptions.api.deselectAll();
  }

  onParentClick() {
    switch(this.listLevel) {
      case ListLevel.publicationCollections:
        this.listProjects();
        break;
      case ListLevel.publications:
        this.listPublicationCollections(this.data.projectName);
        break;
    }
  }

  onAddClick() {
    // Add
  }

  onEditClick() {
    // Edit
    const selRows = this.gridOptions.api.getSelectedRows();
    console.log(selRows);
    if(selRows.length == 1)
      alert('One row selected!');
  }

  onRemoveClick() {
    // Edit
  }

  test() {
    const model = this.gridOptions.api.getModel();
    const row = model.getRow(1);
    row.data.flag = 1;
    // refreshCells is not enough when cell renderer is changed
    // this.gridOptions.api.refreshCells({'rowNodes': [row]});
    this.gridOptions.api.redrawRows({'rowNodes': [row]});
    // row.updateData({title: "Brev", id: "15", flag: 1, published: "Published"});
    // alert(row.data.title);
  }
}

export enum ListLevel {
  projects,
  publicationCollections,
  publications
}

