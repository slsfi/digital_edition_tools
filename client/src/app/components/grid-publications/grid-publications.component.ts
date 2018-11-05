import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material';
import {GridColumnStatusComponent} from '../grid-column-status/grid-column-status.component';
import { environment } from '../../../environments/environment.prod';
import { DataService, ProjectDescriptor } from '../../services/data.service';
import { DialogProjectComponent } from '../dialog-project/dialog-project.component';

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

  projectEdited: ProjectDescriptor;
  //publicationCollectionEdited: PublicationCollectionDescriptor;
  //publicationEdited: PublicationDescriptor;

  @Output() listLevelChanged: EventEmitter<ListLevel> = new EventEmitter<ListLevel>();

  constructor(private data: DataService, public dialog: MatDialog) {
    
    // Set up the grid
    this.gridOptions = <GridOptions>{
      enableSorting: true,
      rowSelection: 'multiple'
    };

    // Set a callback for row style (green text if published)
    this.gridOptions.getRowStyle = function(params) {
      if (params.node.data.published == 1)
        return { color: '#0d6e00' };
    };

    // Set callback so rows can be found with the getRowNode function
    this.gridOptions.getRowNodeId = function(data) {
      return data.id;
    };

    // Grid columns
    this.columnDefs = [
      {headerName: 'Title', field: 'title', width: 200, checkboxSelection: true},
      {headerName: 'Id', field: 'id', width: 70},
      {headerName: 'PublishedHidden', field: 'published', hide: true},
      {headerName: 'Published', field: 'publishedText', width: 90}
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
          tmpTreeData.push({'title': data[i].name, 'id': data[i].id, 'published': data[i].published, 'publishedText': (data[i].published ? 'Yes' : 'No')});
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
          tmpTreeData.push({'title': tmpData[i].id.toString(), 'id': tmpData[i].id, 'published': tmpData[i].published, 'publishedText': (tmpData[i].published ? 'Yes' : 'No')});
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
          tmpTreeData.push({'title': data[i].name, 'id': data[i].id, 'published': data[i].published, 'publishedText': (data[i].published ? 'Yes' : 'No')});
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
          tmpTreeData.push({'title': data[i].name, 'id': data[i].id, 'published': data[i].published, 'publishedText': (data[i].published ? 'Yes' : 'No')});
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
    // Open an edit dialog with empty data
    switch(this.listLevel) {
      case ListLevel.projects:
        this.showProjectDialog({} as any);
        break;
      case ListLevel.publicationCollections:
        // publicationCollection
        break;
      case ListLevel.publications:
        // publication:
        break;
    }
  }

  onEditClick() {
    // Get selected rows
    const selRows = this.gridOptions.api.getSelectedRows();
    // Check that (only) one row is selected
    if(selRows.length == 1) {
      switch(this.listLevel) {
        case ListLevel.projects:
          const project: ProjectDescriptor = {id: selRows[0].id, title: selRows[0].title, published: selRows[0].published};
          this.showProjectDialog(project);
          break;
        case ListLevel.publicationCollections:
          // publicationCollection
          break;
        case ListLevel.publications:
          // publication:
          break;
      }
    }
    else
      alert('You need to select (only) one row to edit!');
  }

  onRemoveClick() {
    // Edit
  }

  showProjectDialog(project: ProjectDescriptor) {
    // Show the dialog
    const dialogRef = this.dialog.open(DialogProjectComponent, {
      width: '700px',
      data: project
    });
    // Subscribe to dialog closed event
    dialogRef.afterClosed().subscribe(result => {
      // If title is undefined, then user cancelled the dialog
      if(result.title !== undefined) { 
        // Keep track of edited project, this will be used if server request is successful
        this.projectEdited = result;
        // id is defined, means that a project has been edited
        if(result.id !== undefined) { 
          this.editProject(result);
          //let rowNode = this.gridOptions.api.getRowNode(result.id);
          //rowNode.setData(this.createProjectGridData(result));
        }
        // Id is not defined, add project
        else {
          this.addProject(result);
          //let rowDataItem = this.createProjectGridData(result);
          //this.gridOptions.api.updateRowData({add: [rowDataItem]});
        }
      }
    });
  }

  // Add a new project
  addProject(project: ProjectDescriptor) {
    // Send a request to the server
    this.data.addProject(project).subscribe(
      // Reqest succeeded
      data => {
        // Set project id from returned data
        this.projectEdited.id = data.project_id;
        // Create a grid row item from the project data
        const rowDataItem = this.createProjectGridData(this.projectEdited);
        // Add the new project row to the grid
        this.gridOptions.api.updateRowData({add: [rowDataItem]});
        // Print data to console
        console.info(data);
      },
      // Request failed
      err => {
        console.info(err);
      }
    );
  }

  // Edit a project
  editProject(project: ProjectDescriptor) {
    // Send a request to the server
    this.data.editProject(project).subscribe(
      // Request succeeded
      data => {
        // Get the row node with the project id of the edited project
        let rowNode = this.gridOptions.api.getRowNode(this.projectEdited.id.toString());
        // Set the new project row data
        rowNode.setData(this.createProjectGridData(this.projectEdited));
        // Print data to console
        console.info(data);
      },
      // Request failed
      err => {
        //this.showSpinner = false;
      }
    );
  }

  createProjectGridData(project: ProjectDescriptor): any {
    let newData = {'title': project.title, 'id': project.id, 'published': project.published, 'publishedText': (project.published ? 'Yes' : 'No')};
    return newData;
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

