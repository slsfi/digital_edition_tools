import {Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, ChangeDetectorRef} from "@angular/core";
import { TreeModel, Ng2TreeSettings } from 'ng2-tree';
import { DocumentDescriptor, DataService } from "../../services/data.service";

@Component({
    selector: 'app-tree-documents',
    templateUrl: './tree-documents.component.html'
})
export class TreeDocumentsComponent implements AfterViewInit {

    public tree: TreeModel;

    // There seems to be a bug that will hide all nodes when the have been loaded asynchronously
    // if hiding the root node when isCollapsedOnInit of the tree is true. So either have isCollapsedOnInit: false
    // or rootIsVisible: true
    public treeSettings: Ng2TreeSettings = {
      rootIsVisible: true
    };

    //gridOptions: GridOptions;
    //columnDefs: any[];
    //rowData: any[];
    //treeData: any;

    //pathCurrent: string = "";
    //pathNew: string = "";
    //pathParent: string = "";

    fileSelected: boolean = false;
    openDocument: string = "";

    showSpinner: boolean = true;

    @ViewChild('treeComponent') treeComponent;

    @Input() openFileText: string = "Open File";
    @Input() doubleClickToOpenFile: boolean = true;
    @Output() documentLoaded: EventEmitter<DocumentDescriptor> = new EventEmitter<DocumentDescriptor>();

    constructor(private data: DataService, private changeDetector : ChangeDetectorRef) {

      this.tree = {
        value: 'GIT',
        id: 1,
        settings: {
          'static': true,
          'isCollapsedOnInit': true,
          'templates': {
            'node': '<img src="assets/images/folder.png" />',
            'leaf': '<img src="assets/images/file.png" />'
          }
        },
        children: []
      };

      // Get the folder structure
      //this.getTree(this.pathNew);
    }

    ngOnInit() {
      setTimeout(() => {
        this.refreshTree();
      }, 1000);
    }

    ngAfterViewInit(): void {
      //let oopNodeController = this.treeComponent.getController();//getControllerByNodeId(1);
      //oopNodeController.expand();
    }

    /*getTree(path: string) {
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
    }*/

    /*fillTree(path: string) {
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
    }*/

    /*onGridReady(params) {
        params.api.sizeColumnsToFit();
    }*/

    /*onSelectionChanged() {
      let rowSelection = this.gridOptions.api.getSelectedRows();
      if(rowSelection.length > 0) {
        if(rowSelection[0].type == "File")
          this.fileSelected = true;
        else
          this.fileSelected = false;
      }
    }*/

    /*onRowClick(event) {
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
      // Assume file
      else {
        if(!this.doubleClickToOpenFile) {
          let doc: DocumentDescriptor = {name: event.data.name, path: this.pathCurrent};
          this.documentLoaded.emit(doc);
        }
      }
    }*/

    /*onRowDoubleClick(event) {
      if(this.doubleClickToOpenFile && event.data.type == "File") {
        let doc: DocumentDescriptor = {name: event.data.name, path: this.pathCurrent};
        this.documentLoaded.emit(doc);
      }
    }*/

    /*onLoadClick() {
      // Load xml from server
      let rowSelection = this.gridOptions.api.getSelectedRows();
      if(rowSelection.length > 0) {
        if(rowSelection[0].type == "File") {
          let doc: DocumentDescriptor = {name: rowSelection[0].name, path: this.pathCurrent};
          this.documentLoaded.emit(doc);
        }
      }
    }*/

    onTestClick() {
      // This does not work after tree has been updated
      let oopNodeController = this.treeComponent.getControllerByNodeId(1);
      oopNodeController.expand();
    }

    onRefreshClick() {
      this.refreshTree();
    }

    refreshTree() {
      this.showSpinner = true;
      this.data.getDocumentTree("", true).subscribe(
        data => { 
          this.fillTree(data);
          this.showSpinner = false;
        },
        err => {
        });
    }

    fillTree(data: any) {
      // Reset selection variables
      this.fileSelected = false;
      this.openDocument = "";

      let tmpTreeData = this.buildTree(data);

      // Create a clone of the tree object
      let treeTmp: TreeModel = {
        value: "GIT",
        id: 1,
        settings: this.tree.settings,
        children: tmpTreeData
      };
      // Destroy the current tree for garbage collector
      this.tree = null;
      // Assign the new tree
      this.tree = treeTmp;
      // Expand the root (with a timeout
      setTimeout(()=>{
        let oopNodeController = this.treeComponent.getController();
        oopNodeController.expand();
      }, 100);
    }

    buildTree(data: any) {
      let tmpTreeData = [];
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          // Check if folder (property not null)
          if(data[key] != null) {
            tmpTreeData.push({ 'value': key, 'children': this.buildTree(data[key]) });
          }
          // otherwise assume file
          else {
            tmpTreeData.push({'value': key});
          }
        }
      }
      return tmpTreeData;
    }

    handleSelected(event: any) {
      if(event.node.children == null) { // file node, leaf with no child nodes
        this.openDocument = this.getFullPath(event.node, "");
        this.fileSelected = true;
        console.info(event.node);
        let doc: DocumentDescriptor = {name: event.node.value, path: this.getPath(event.node, "")};
        this.documentLoaded.emit(doc);
      }
      else
        this.fileSelected = false;
    }
    
    // Get path of current file node in tree
    getPath(treeItem: any, filePath: string): string {
      if(treeItem.children != null) { // Don't add filename (leaf) to path
        if(treeItem.parent != null) {// Don't add topmost level
          if(filePath.length > 0)
            filePath = treeItem.value + "/" + filePath;
          else
            filePath = treeItem.value;
        }
      }
      if(treeItem.parent != null)
        filePath = this.getPath(treeItem.parent, filePath);
      return filePath;
    }

    // Get full path including filename from tree
    getFullPath(treeItem: any, filePath: string): string {
      if(filePath.length > 0)
        filePath = treeItem.value + "/" + filePath;
      else
        filePath = treeItem.value;
      if(treeItem.parent != null)
        filePath = this.getFullPath(treeItem.parent, filePath);
      return filePath;
    }
}

