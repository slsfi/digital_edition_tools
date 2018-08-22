import {Component, Output, EventEmitter} from "@angular/core";
import {GridColumnStatusComponent} from "../grid-column-status/grid-column-status.component";
import { DataService } from "../../services/data.service";

import {GridOptions, RowNode} from "ag-grid/main";

@Component({
    selector: 'app-grid-documents',
    templateUrl: './grid-documents.component.html'
})
export class GridDocumentsComponent {

    gridOptions: GridOptions;
    columnDefs: any[];
    rowData: any[];
    treeData: any;

    pathCurrent: string = "";
    pathNew: string = "";
    pathParent: string = "";

    openDocument: string = "";

    @Output() documentLoaded: EventEmitter<string> = new EventEmitter<string>();

    constructor(private data: DataService) {

      // Get the folder structure
      this.getTree(this.pathNew);

      this.gridOptions = <GridOptions>{
        enableSorting: false,
        rowSelection: "single"
      };

      this.gridOptions.getRowStyle = function(params) {
        if(params.node.data.type == 'Folder') {
            return { color: '#008800' }
        }
      }

      this.columnDefs = [
          {headerName: "Name", field: "name"},
          {headerName: "Type", field: "type"}
      ];
    }

    getTree(path: string) {
      // Get "root" folder? In this case we need to send a request to the server
      if(path.length == 0) {
        this.data.getDocumentTree(path).subscribe(
          data => { 
            alert(data);
          },
          err => {
            // Return root folder (only for testing)
            if(this.pathNew.length == 0) {
              this.treeData = {
                "est": {
                  "1_1_est.xml": null
                },
                "com": {
                  "1_1_com_1.xml": null,
                  "1_1_com_2.xml": null
                },
                "inl": {
                  "1_1_eng.xml": null,
                  "1_1_fin.xml": null,
                  "1_1_swe.xml": null
                },
                "xslt": {
                  "est.xsl": null,
                  "com.xsl": null,
                  "inl.xsl": null
                },
                "test_eng.xml": null,
                "test_fin.xml": null,
                "test_swe.xml": null
              };
              this.fillTree(this.pathNew);
            }
            // Return com folder (only for testing)
            else {
            }
            console.log(err); 
          }
        );
      }
      // Child folder
      else {
        this.fillTree(path);
      }
    }

    fillTree(path: string) {
      // Create a variable for temporary tree data. Add the default parent folder.
      let tmpRowData = [{"name": "..", "type": "Folder"}];
      // Get object of folder (only supports one level yet, should support multiple levels)
      var tmpTreeData: any;
      if(path.length == 0)
        tmpTreeData = this.treeData;
      else
        tmpTreeData = this.treeData[path];
      // Iterate the temporary tree
      for (var key in tmpTreeData) {
        if (tmpTreeData.hasOwnProperty(key)) {
          // Check if folder (property not null)
          if(tmpTreeData[key] != null) {
            tmpRowData.push({'name': key, 'type': "Folder"});
          }
          // otherwise assume file
          else {
            tmpRowData.push({'name': key, 'type': "File"});
          }
        }
      }
      this.rowData = tmpRowData;
    }

    onGridReady(params) {
        params.api.sizeColumnsToFit();
    }

    onRowClick(event) {
      // Is the clicked item a folder?
      if(event.data.type == "Folder") {
        // Show loading overlay of grid
        //this.gridOptions.api.showLoadingOverlay()
        // Clear grid
        this.rowData = [];
        // "Parent" folder
        if(event.data.name.startsWith("..")) {
          // Set potential new path to be parent path
          this.pathNew = this.pathParent;
          // Send the request to the server
          this.getTree(this.pathNew);
        }
        // "Normal" folder
        else {
          // Set the potential new path to the current path + the clicked item name
          this.pathNew = this.pathCurrent + '/' + event.data.name;
          // Send the request to the server
          this.getTree(this.pathNew);
        }
        
      }
    }

    onRowDoubleClick(event) {
      this.load(event.data);
    }

    toRootFolder() {
      // Clear grid
      this.rowData = [];
      // Get root folder (refresh)
      this.pathNew = "";
      this.getTree(this.pathNew);
    }

    onLoadClick() {
      // Load xml from server
      let rowSelection = this.gridOptions.api.getSelectedRows();
      if(rowSelection.length > 0)
        this.load(rowSelection[0]);
    }

    onSaveClick() {
      // Save xml file back to server
      
    }

    load(row: any) {
      console.info(row);
      if(row.type == "File") {
        this.data.getDocument(this.pathCurrent, row.name).subscribe(
          data => { 
            // Set openDocument variable and send decoded to parent component through @Output
            alert(data);
          },
          err => {
            // Send data to parent component as a test
            this.documentLoaded.emit(this.b64_to_utf8("PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxURUkgeG1sbnM9Imh0dHA6Ly93d3cuc2xzLmZpL3RlaSI+DQogIDx0ZWlIZWFkZXI+DQogICAgPGZpbGVEZXNjPg0KICAgICAgPHRpdGxlU3RtdD4NCiAgICAgICAgPHRpdGxlPkxqdW5nYmxvbW1vciBJLCBIZnJzIDE4NDU8L3RpdGxlPg0KICAgICAgICA8cmVzcFN0bXQ+DQogICAgICAgICAgPHJlc3A+S29kbmluZzo8L3Jlc3A+DQogICAgICAgICAgPG5hbWU+Q0UgKDA3LTEwLTIwMDkpPC9uYW1lPg0KICAgICAgICA8L3Jlc3BTdG10Pg0KICAgICAgICA8cmVzcFN0bXQ+DQogICAgICAgICAgPHJlc3A+R3JhbnNrYWQgYXY6PC9yZXNwPg0KICAgICAgICAgIDxuYW1lPlRHICgyNi0xMC0yMDA5KTwvbmFtZT4NCiAgICAgICAgPC9yZXNwU3RtdD4NCiAgICAgIDwvdGl0bGVTdG10Pg0KICAgICAgPHB1YmxpY2F0aW9uU3RtdD4NCiAgICAgICAgPHB1Ymxpc2hlcj5aYWNoYXJpYXMgVG9wZWxpdXMgU2tyaWZ0ZXI8L3B1Ymxpc2hlcj4NCiAgICAgIDwvcHVibGljYXRpb25TdG10Pg0KICAgICAgPG5vdGVzU3RtdCAvPg0KICAgICAgPHNvdXJjZURlc2M+DQogICAgICAgIDxwIC8+DQogICAgICA8L3NvdXJjZURlc2M+DQogICAgPC9maWxlRGVzYz4NCiAgICA8ZW5jb2RpbmdEZXNjPjxjbGFzc0RlY2w+PHRheG9ub215IHhtbDppZD0iY2F0X2dlbnJlIj48Y2F0ZWdvcnkgeG1sOmlkPSJjZ19wb2VtIj48Y2F0RGVzYz5Qb2VtPC9jYXREZXNjPjwvY2F0ZWdvcnk+PGNhdGVnb3J5IHhtbDppZD0iY2dfbGV0dGVyIj48Y2F0RGVzYz5MZXR0ZXI8L2NhdERlc2M+PC9jYXRlZ29yeT48Y2F0ZWdvcnkgeG1sOmlkPSJjZ19jaGlsZHJlbnNsaXRlcmF0dXJlIj48Y2F0RGVzYz5DaGlsZHJlbidzIGxpdGVyYXR1cmU8L2NhdERlc2M+PC9jYXRlZ29yeT48Y2F0ZWdvcnkgeG1sOmlkPSJjZ19kaWFyeSI+PGNhdERlc2M+RGlhcnk8L2NhdERlc2M+PC9jYXRlZ29yeT48Y2F0ZWdvcnkgeG1sOmlkPSJjZ19ub25maWN0aW9uIj48Y2F0RGVzYz5Ob24tZmljdGlvbjwvY2F0RGVzYz48L2NhdGVnb3J5PjxjYXRlZ29yeSB4bWw6aWQ9ImNnX3Byb3NlIj48Y2F0RGVzYz5Qcm9zZTwvY2F0RGVzYz48L2NhdGVnb3J5PjxjYXRlZ29yeSB4bWw6aWQ9ImNnX2RyYW1hIj48Y2F0RGVzYz5EcmFtYTwvY2F0RGVzYz48L2NhdGVnb3J5PjwvdGF4b25vbXk+PHRheG9ub215IHhtbDppZD0iY2F0X2VkaXRvcmlhbCI+PGNhdGVnb3J5IHhtbDppZD0iY2VfcmVhZGluZ3RleHQiPjxjYXREZXNjPlJlYWRpbmcgdGV4dDwvY2F0RGVzYz48L2NhdGVnb3J5PjxjYXRlZ29yeSB4bWw6aWQ9ImNlX2ludHJvZHVjdGlvbiI+PGNhdERlc2M+SW50cm9kdWN0aW9uPC9jYXREZXNjPjwvY2F0ZWdvcnk+PGNhdGVnb3J5IHhtbDppZD0iY2VfdGl0bGVwYWdlIj48Y2F0RGVzYz5UaXRsZSBQYWdlPC9jYXREZXNjPjwvY2F0ZWdvcnk+PGNhdGVnb3J5IHhtbDppZD0iY2VfYW5ub3RhdGlvbnMiPjxjYXREZXNjPkFubm90YXRpb25zPC9jYXREZXNjPjwvY2F0ZWdvcnk+PGNhdGVnb3J5IHhtbDppZD0iY2VfYmFzZXRleHQiPjxjYXREZXNjPkJhc2UgdGV4dDwvY2F0RGVzYz48L2NhdGVnb3J5PjxjYXRlZ29yeSB4bWw6aWQ9ImNlX3ZlcnNpb24iPjxjYXREZXNjPlZlcnNpb248L2NhdERlc2M+PC9jYXRlZ29yeT48Y2F0ZWdvcnkgeG1sOmlkPSJjZV9tYW51c2NyaXB0Ij48Y2F0RGVzYz5NYW51c2NyaXB0PC9jYXREZXNjPjwvY2F0ZWdvcnk+PC90YXhvbm9teT48L2NsYXNzRGVjbD48L2VuY29kaW5nRGVzYz48cHJvZmlsZURlc2M+DQogICAgICA8aGFuZE5vdGVzPg0KICAgICAgICA8aGFuZE5vdGUgLz4NCiAgICAgICAgPGhhbmROb3RlIC8+DQogICAgICA8L2hhbmROb3Rlcz4NCiAgICA8Y3JlYXRpb24+PG9yaWdEYXRlPjE4NDUtMDAtMDA8L29yaWdEYXRlPjxpZE5vPjFfMTwvaWRObz48aWRObyB0eXBlPSJib29raWQiPjE8L2lkTm8+PHRpdGxlIHR5cGU9Im1haW4iPkxqdW5nYmxvbW1vcjwvdGl0bGU+PC9jcmVhdGlvbj48dGV4dENsYXNzPjxjYXRSZWYgdGFyZ2V0PSJjZ19wb2VtIiAvPjxjYXRSZWYgdGFyZ2V0PSJjZV9yZWFkaW5ndGV4dCIgLz48L3RleHRDbGFzcz48L3Byb2ZpbGVEZXNjPg0KICAgIDxyZXZpc2lvbkRlc2M+DQogICAgICA8Y2hhbmdlPg0KICAgICAgPC9jaGFuZ2U+DQogICAgICA8Y2hhbmdlPg0KICAgICAgPC9jaGFuZ2U+DQogICAgPC9yZXZpc2lvbkRlc2M+DQogIDwvdGVpSGVhZGVyPg0KICA8dGV4dD4NCiAgICA8Ym9keSB4bWw6c3BhY2U9InByZXNlcnZlIj4NCiAgICAgIDwhLS0g4oCTIMK7IOKAmSAtLT4NCiAgICAgIDxkaXYgdHlwZT0icG9lbSI+DQogICAgICAgIDxwYiB0eXBlPSJvcmlnIHVucHJpbnRlZCIgbj0iMSIgLz4NCiAgICAgICAgPHBiIHR5cGU9IlpUUyIgbj0iMyIgLz4NCiAgICAgICAgPGhlYWQgdHlwZT0idGl0bGUiIHhtbDppZD0iaDEiPkxqdW5nYmxvbW1vci48L2hlYWQ+DQogICAgICAgIDxsZyB4bWw6aWQ9ImxnMSI+DQogICAgICAgICAgPGwgbj0iMSI+VmlsZGEgc2tvZ2VuIGhhciBzaW4gYmxvbW1hPC9sPg0KICAgICAgICAgIDxsIG49IjIiPk9jaCBzaW4gZG9mdCBoYXIgw7ZkZW1hcmtlbiw8L2w+DQogICAgICAgICAgPGwgbj0iMyI+TGp1bmdlbiBoYXIgc2luIGJsZWthIHJvZG5hZCw8L2w+DQogICAgICAgICAgPGwgbj0iNCI+SGVkZW4gw6RnZXIgb2NrIHNpbiBnbMOkZGplOzwvbD4NCiAgICAgICAgICA8cGIgdHlwZT0ib3JpZyB1bnByaW50ZWQiIG49IjIiIC8+DQogICAgICAgICAgPGwgbj0iNSI+T2NoIGRldCByaWthIG1lbnNrb2hqZXJ0YXQsPC9sPg0KICAgICAgICAgIDxsIG49IjYiPg0KICAgICAgICAgICAgPGFuY2hvciB4bWw6aWQ9InN0YXJ0MzUwIiAvPlNrYWxsLCBtZXIgYXJtdCDDpG4gw7ZkZW1hcmtlbiw8L2w+DQogICAgICAgICAgPGwgbj0iNyI+RmF0dGlndCBtZXIgw6RuIHNvcmdzbmEgaGVkZW4sPC9sPg0KICAgICAgICAgIDxsIG49IjgiPkRldCBlaiBzaW5hIGJsb21tb3IgYsOkcmEsPC9sPg0KICAgICAgICAgIDxsIG49IjkiPlNqZWxmIHNpbiBsanVmdmEgdHLDtnN0IGVqIG7DpHJhPzxhbmNob3IgeG1sOmlkPSJlbmQzNTAiIC8+PC9sPg0KICAgICAgICA8L2xnPg0KICAgICAgICA8bGcgeG1sOmlkPSJsZzIiPg0KICAgICAgICAgIDxsIG49IjEwIj4NCiAgICAgICAgICAgIDxhbmNob3IgeG1sOmlkPSJzdGFydDM1NyIgLz5Ow6VncmEgc8OlbmdlciBoYXIgamFnIHNqdW5naXQsPC9sPg0KICAgICAgICAgIDxsIG49IjExIj5Ow6RyIGkgYnLDtnN0ZXQgaGplcnRhdCBicsOkbmRlLDwvbD4NCiAgICAgICAgICA8bCBuPSIxMiI+DQogICAgICAgICAgICA8YW5jaG9yIHhtbDppZD0ic3RhcnQzNTYiIC8+U2p1bmdpdCBkZW0gZsO2ciA8YW5jaG9yIHhtbDppZD0ic3RhcnQzNTEiIC8+PHBlcnNOYW1lPkVsbGlzPC9wZXJzTmFtZT48YW5jaG9yIHhtbDppZD0iZW5kMzUxIiAvPiBnbMOkZGplPC9sPg0KICAgICAgICAgIDxsIG49IjEzIj5PY2ggZsO2ciA8YW5jaG9yIHhtbDppZD0ic3RhcnQzNTIiIC8+PHBlcnNOYW1lPkFpbmFzPC9wZXJzTmFtZT48YW5jaG9yIHhtbDppZD0iZW5kMzUyIiAvPiBhZnRvbnRhbmthcjs8L2w+DQogICAgICAgICAgPGwgbj0iMTQiPg0KICAgICAgICAgICAgPGFuY2hvciB4bWw6aWQ9InN0YXJ0MzUzIiAvPg0KICAgICAgICAgICAgPHBlcnNOYW1lPlNlbG1hczwvcGVyc05hbWU+DQogICAgICAgICAgICA8YW5jaG9yIHhtbDppZD0iZW5kMzUzIiAvPiBwYW5uYSBkZXJ2aWQgbGp1c25hdCw8L2w+DQogICAgICAgICAgPGwgbj0iMTUiPg0KICAgICAgICAgICAgPGFuY2hvciB4bWw6aWQ9InN0YXJ0MzU0IiAvPg0KICAgICAgICAgICAgPHBlcnNOYW1lPkZhbm55czwvcGVyc05hbWU+DQogICAgICAgICAgICA8YW5jaG9yIHhtbDppZD0iZW5kMzU0IiAvPiDDtm1tYSDDtmdvbiBza2ltcmF0LDwvbD4NCiAgICAgICAgICA8bCBuPSIxNiI+DQogICAgICAgICAgICA8YW5jaG9yIHhtbDppZD0ic3RhcnQzNTUiIC8+DQogICAgICAgICAgICA8cGVyc05hbWUgY29ycmVzcD0icGUxMCI+RW1tYXM8L3BlcnNOYW1lPg0KICAgICAgICAgICAgPGFuY2hvciB4bWw6aWQ9ImVuZDM1NSIgLz4gYmxpZGEgYmzDpWEgYmxpY2thcjxhbmNob3IgeG1sOmlkPSJlbmQzNTYiIC8+PC9sPg0KICAgICAgICAgIDxsIG49IjE3Ij5LbGFyYXJlIMOkbiBzdGplcm5vciBzdHLDpWxhdC48YW5jaG9yIHhtbDppZD0iZW5kMzU3IiAvPjwvbD4NCiAgICAgICAgICA8bCBuPSIxOCI+U8OlIGkgdmFja3JhIMO2Z29ucyB2w6RybWE8L2w+DQogICAgICAgICAgPGwgbj0iMTkiPlPDpW5nZXJuYSBsaWt0IGRyaWZ2b3Igc211bHRpdCw8L2w+DQogICAgICAgICAgPGwgbj0iMjAiPlJ1bm5pdCB1cHAgc29tIG1vcmdvbmRyw7ZtbWFyIDwvbD4NCiAgICAgICAgICA8bCBuPSIyMSI+SSBldHQgdsOlcmxpZ3QgaGplcnRhcyBrw6RybGVrLjwvbD4NCiAgICAgICAgICA8bCBuPSIyMiI+TnUgamFnIHNhbWxhdCBoYXIgZGUgc3DDpGRhLDwvbD4NCiAgICAgICAgICA8bCBuPSIyMyI+DQogICAgICAgICAgICA8YW5jaG9yIHhtbDppZD0ic3RhcnQzNTgiIC8+U2tpY2thciBkZW0gw6V0IDxwbGFjZU5hbWUgeG1sOmxhbmc9ImZpbiIgY29ycmVzcD0icGw2MiI+U3VvbWlzPC9wbGFjZU5hbWU+IGZsaWNrb3IsPGFuY2hvciB4bWw6aWQ9ImVuZDM1OCIgLz48L2w+DQogICAgICAgICAgPGwgbj0iMjQiPkF0dCBlbiBzb3Jnc2VuIHN0dW5kIGbDtnJkcmlmdmEsPC9sPg0KICAgICAgICAgIDxsIG49IjI1Ij5BdHQgaSB2w6VyZW5zIGRvZnQgb2NoIGzDpG5ndGFuIDwvbD4NCiAgICAgICAgICA8bCBuPSIyNiI+U8OlbmdlbnMgcm8gZGUgaHVsZGEgZ2lmdmEuPC9sPg0KICAgICAgICA8L2xnPg0KICAgICAgICA8ZGF0ZWxpbmU+DQogICAgICAgICAgPGRhdGUgd2hlbj0iMTg0NSI+PHN1cHBsaWVkIHNvdXJjZT0iU8OlbmdlciBJLCBTdGhsbSAxODYwIj4xODQ1Ljwvc3VwcGxpZWQ+PC9kYXRlPg0KICAgICAgICA8L2RhdGVsaW5lPg0KICAgICAgPC9kaXY+DQogICAgICANCiAgICA8L2JvZHk+DQogIDwvdGV4dD4NCjwvVEVJPg=="));
            // Load a "dummy" file
            console.log(err); 
          }
        );
      }
    }

    b64_to_utf8( stringBase64: string ) {
      return decodeURIComponent(escape(atob(stringBase64)));
    }

    fill
    /*selectAllRows() {
        this.gridOptions.api.selectAll();
    }

    deselectAllRows() {
      this.gridOptions.api.deselectAll();
    }*/

    /*test() {
      let model = this.gridOptions.api.getModel();
      let row = model.getRow(1);
      //row.data.isSet = 1;
      // refreshCells is not enough when cell renderer is changed
      //this.gridOptions.api.refreshCells({'rowNodes': [row]});
      this.gridOptions.api.redrawRows({'rowNodes': [row]});
      //row.updateData({title: "Brev", id: "15", isSet: 1, status: "Published"});
      //alert(row.data.title);
    }*/
}

