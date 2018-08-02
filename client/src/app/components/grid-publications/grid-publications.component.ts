import {Component} from "@angular/core";
import {GridColumnStatusComponent} from "../grid-column-status/grid-column-status.component";

import {GridOptions, RowNode} from "ag-grid/main";

@Component({
    selector: 'app-grid-publications',
    templateUrl: './grid-publications.component.html'
})
export class GridPublicationsComponent {
    gridOptions: GridOptions;
    columnDefs: any[]
    rowData: any[];

    constructor() {
        this.gridOptions = <GridOptions>{
          enableSorting: true,
          rowSelection: "multiple"
        };

        this.gridOptions.getRowStyle = function(params) {
          if(params.node.data.isSet == 0) {
              return { color: 'red' }
          }
        }

        this.columnDefs = [
            {headerName: "Title", field: "title", checkboxSelection: true},
            {headerName: "Id", field: "id"},
            {headerName: "IsSet", field: "isSet", hide: true},
            {headerName: "Status", field: "status", cellRendererFramework: GridColumnStatusComponent}
        ];

        this.rowData = [
            {title: "Ljungblommor", id: "1", isSet: 1, status: "Not published"},
            {title: "Brev", id: "15", isSet: 0, status: "Published"},
            {title: "Finland framställt i teckningar", id: "14", isSet: 1, status: "Not published"}
        ]
    }

    onGridReady(params) {
        params.api.sizeColumnsToFit();
    }

    selectAllRows() {
        this.gridOptions.api.selectAll();
    }

    deselectAllRows() {
      this.gridOptions.api.deselectAll();
    }

    test() {
      let model = this.gridOptions.api.getModel();
      let row = model.getRow(1);
      row.data.isSet = 1;
      // refreshCells is not enough when cell renderer is changed
      //this.gridOptions.api.refreshCells({'rowNodes': [row]});
      this.gridOptions.api.redrawRows({'rowNodes': [row]});
      //row.updateData({title: "Brev", id: "15", isSet: 1, status: "Published"});
      //alert(row.data.title);
    }
}

