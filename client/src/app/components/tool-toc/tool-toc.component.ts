/*
Name: tool-toc
Description: Use this to create table of contents for publication collections
Notes: This component uses nestable2, which is a jQuery plugin.
Although it's not recommended to use jQuery with Angular, there
isn't any good drag and drop treeview system available for Angular.
*/

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { saveAs } from 'file-saver/FileSaver';
import { DataService, DataItemType } from '../../services/data.service';
import { MenuItem } from '../../classes/menu-item';
import { environment } from '../../../environments/environment';
import { DialogPublicationCollectionComponent } from '../dialog-publication-collection/dialog-publication-collection.component';
import { GridPublicationsComponent } from '../grid-publications/grid-publications.component';
import { stringify } from '@angular/core/src/render3/util';
import { PublicationCollectionDescriptor } from '../../services/data.service';

// Declare $ as any to allow nestable jquery
declare var $: any;

@Component({
  selector: 'app-tool-toc',
  templateUrl: './tool-toc.component.html',
  styleUrls: ['./tool-toc.component.css']
})
export class ToolTOCComponent implements OnInit {

  dataItemType = DataItemType;
  elementSelector = '#menu';
  itemCurrent: MenuItem;
  publicationCollection: PublicationCollectionDescriptor;
  publicationCollectionText = '';

  isDisabled: Boolean = true;
  tocLoaded: Boolean = false;

  @ViewChild(GridPublicationsComponent) private publicationsComponent: GridPublicationsComponent;

  // Constructor, inject the instance of DataService
  constructor(private data: DataService, public dialog: MatDialog) { }

  ngOnInit() {

    // this.selectedCollection = {type: '', text: '', collectionId: ''};
    this.publicationCollection = {id: 0, title: '', published: 0};
    // Change active tool
    this.data.changeTool('Table of Contents');
    // Create an instance of MenuItem
    this.itemCurrent = new MenuItem();
    // Create json data for nestable
    // const jsonMenu = [{'id':1,'url':1,'itemId':'','type':'link','content':'Ljungblommor','text':'Ljungblommor'},
    // {'id':2,'url':2,'itemId':'','type':'link',
    // 'content':'En ros','text':'En ros'},{'id':3,'url':3,'itemId':'','type':'heading1','content':'Andra dikter','text':'Andra dikter',
    // 'children':[{'id':4,'url':4,'itemId':'','type':'link','content':'Våren','text':'Våren'},
    // {'id':5,'url':5,'itemId':'','type':'link','foo':'bar'
    // ,'content':'Hösten','text':'Hösten'}]}];
    // Populate the menu
    this.populateMenu([]);
  }

  createEmptyMenu(): any {
    return;
  }

  populateMenu(json: any) {

    // Convert json string to an object so it can be parsed
    // let oJson = JSON.parse(json);
    let oJson = json;
    if ( oJson.collectionId !== undefined ) {
      oJson = oJson.children;
    }

    // Copy the text properties to content properties needed by nestable
    this.processJsonForLoad(oJson, '1');

    // Set options for nestable
    const options = {
      'json': JSON.stringify(oJson),
      // We need to create the callback with an arrow function (=>) to maintain correct scope
      callback: (l, e) => {
        this.callbackItemMoved(l, e);
      }
    };
    // Initialise nestable with options (including data)
    $(this.elementSelector).nestable(options);
  }

  callbackItemMoved(l: any, e: any) {
    // Update current menu item from jQuery element
    this.itemCurrent.GetElement(e);
    // Set edit flags
    this.itemCurrent.editItem = true;
    this.itemCurrent.newItem = false;
    this.isDisabled = false;
  }

  onPopulate() {
    // Clear form
    this.clearForm();
    // Deactivate nestable before reactivation
    $(this.elementSelector).nestable('destroy');
    // Create json data for nestable
    const jsonMenu = [{'url': 1, 'type': 'est', 'content': 'Ljungblommor', 'text': 'Ljungblommor'},
    {'url': 2, 'type': 'est', 'content': 'En ros', 'text': 'En ros'},
    {'url': 3, 'type': 'heading1', 'content': 'Andra dikter', 'text': 'Andra dikter',
    'children': [{'url': 4, 'type': 'est', 'content': 'Våren', 'text': 'Våren'},
    {'url': 5, 'type': 'est', 'foo': 'bar', 'content': 'Hösten', 'text': 'Hösten'}]}];
    // Populate menu and reactivate nestable
    this.populateMenu(jsonMenu);
  }

  onPublicationOpened(event: any) {
    if (!this.isDisabled) {
      this.itemCurrent.itemId = this.publicationCollection.id.toString() + '_' + event.id.toString();
    }
  }

  clearForm() {
    // Reset item
    this.eventNewItem();
    // Disable form
    this.isDisabled = true;
    // Set new/edit item flags
    this.itemCurrent.newItem = false;
    this.itemCurrent.editItem = false;
  }

  eventNewItem() {
    // Enable form
    this.isDisabled = false;
    // Reset current item variables
    this.itemCurrent.Reset();
    // Set new item flag
    this.itemCurrent.newItem = true;
  }

  eventAddItem() {
    // Add item to menu
    const added = this.itemCurrent.AddElement(this.elementSelector);
    // Update edit flags
    if (added) {
      this.itemCurrent.editItem = false;
      this.clearForm();
    }
  }

  eventUpdateItem() {
    // Update current item
    this.itemCurrent.SetElement(this.itemCurrent.element);
    this.clearForm();
  }

  eventDeleteItem() {
    // Delete current item
    $(this.elementSelector).nestable('remove', this.itemCurrent.id);
    this.clearForm();
  }

  collapseAll() {
    $(this.elementSelector).nestable('collapseAll');
  }

  expandAll() {
    $(this.elementSelector).nestable('expandAll');
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.which === 13) { // Enter pressed
      // Add / update item
      if (this.itemCurrent.newItem) {
        this.eventAddItem();
      } else {
        this.eventUpdateItem();
      }
    }
  }

  onCreateFromCollection() {
    this.showPublicationCollectionDialogCreate('Select Collection to create ToC for');
  }

  onLoadFromServer() {
    this.showPublicationCollectionDialogLoad('Select Collection to load ToC from');
  }

  onFileInput(event: any) {
    // Get the list of selected files
    const files: FileList = event.target.files;
    // Create a file reader and create a callback for the file read
    const reader = new FileReader();
    reader.onload = () => {
      this.clearForm();
      // Deactivate nestable before reactivation
      $(this.elementSelector).nestable('destroy');
      // Create json data for nestable
      // const jsonMenu: string = reader.result.toString();
      const jsonMenu: any = JSON.parse(reader.result.toString());
      // Populate menu and reactivate nestable
      this.populateMenu(jsonMenu);
      // Set loaded to true
      this.tocLoaded = true;
    };
    // Read the file as text
    reader.readAsText(files.item(0));
    // Reset value of file input so same file(s) can be selected again
    event.srcElement.value = null;
  }

  tocToString(): string {
    // Get menu as a json object
    const jsonObj = $(this.elementSelector).nestable('serialize');
    // Remove the 'id' properties from the json object
    this.processJsonForSave(jsonObj);

    const tmpObj = {text: '', collectionId: '', type: '', children: Array<object>()};
    tmpObj.text = this.publicationCollection.title;
    tmpObj.collectionId = this.publicationCollection.id.toString();
    tmpObj.type = 'title';
    tmpObj.children = jsonObj;

    // Stringify the json object
    const tocString = JSON.stringify(tmpObj);

    return tocString;
  }

  saveToClient() {
    // Convert the toc to a string
    const toc = this.tocToString();
    // Create a blob from the string
    const blob = new Blob([toc], { type: 'application/json' });
    // Save the blob
    saveAs(blob, 'menu.json');
  }

  onSaveToServer(event: any) {
    // Convert the toc to a string
    const toc = this.tocToString();
    // Send request to the server
    this.data.putTOC(this.data.projectName, this.publicationCollection, toc).subscribe(
      data => {
        console.log(data);
      },
      err => { console.log(err); }
    );
  }

  processJsonForLoad(obj: any, menuItemId: string) {
    if (obj instanceof Object) {
      // Copy 'text' property to a 'content' property
      if (obj.hasOwnProperty('text')) {
        obj.content = obj.text;
      }

      // if(Array.isArray(obj))
      //  alert(JSON.stringify(obj));

      // Add an id property
      obj.id = menuItemId;

      // Recursive call for child objects
      let i = 1;
      let k: any = '';
      for ( k in obj ) {
        if ( obj.hasOwnProperty(k) ) {
          // There seems to be a small issue with an uneccessary level (created for json array) when creating the
          // menuItemIds, but it works. The most important is that the ids are unique. When creating new items, a
          // timestamp will be used as id so that won't create conficts.
          this.processJsonForLoad( obj[k], menuItemId + i.toString() );
          i++;
        } else {
          i++;
        }
      }
    }
  }

  processJsonForSave(obj: any) {
    let k;
    if (obj instanceof Object) {
      // Delete the possible 'id' property
      if (obj.hasOwnProperty('id')) {
        delete obj.id;
      }

      if (obj.hasOwnProperty('itemid')) {
        obj.itemId = obj.itemid;
        delete obj.itemid;
      }

      // Recursive call for child objects
      for (k in obj) {
        if (obj.hasOwnProperty(k)) {
          this.processJsonForSave( obj[k] );
        }
      }
    }
  }

  showPublicationCollectionDialogCreate(header: string) {
    const dialogRef = this.dialog.open(DialogPublicationCollectionComponent, {
      width: '700px',
      data: header
    });

    dialogRef.afterClosed().subscribe(result => {
      this.clearForm();
      this.publicationCollection = result;
      this.publicationCollectionText = result.id.toString() + ': ' + result.title;
      this.createTOCFromCollection(this.publicationCollection);
      // Set loaded to true
      this.tocLoaded = true;
      // Set the current publicationCollection to the data instance
      this.data.publicationCollection = this.publicationCollection.id;
      // Update the publications for the selected collection
      this.updatePublications();
    });
  }

  showPublicationCollectionDialogLoad(header: string) {
    const dialogRef = this.dialog.open(DialogPublicationCollectionComponent, {
      width: '700px',
      data: header
    });

    dialogRef.afterClosed().subscribe(result => {
      this.clearForm();
      this.publicationCollection = result;
      this.publicationCollectionText = result.id.toString() + ': ' + result.title;
      this.data.getTOC(this.data.projectName, this.publicationCollection).subscribe(
        data => {
          // Deactivate nestable before reactivation
          $(this.elementSelector).nestable('destroy');
          // Populate menu with the loaded data and reactivate nestable
          this.populateMenu(data);
          // Set loaded to true
          this.tocLoaded = true;
          // Set the current publicationCollection to the data instance
          this.data.publicationCollection = this.publicationCollection.id;
          // Update the publications for the selected collection
          this.updatePublications();
        },
        err => {
          alert('ToC could not be loaded (probably doesn\'t exist).');
        }
      );
    });
  }

  createTOCFromCollection(collection: PublicationCollectionDescriptor) {
    this.data.getPublications(this.data.projectName, collection.id).subscribe(
      data => {
        // Create menu items from all the publications
        const jsonObj = [];
        for (let i = 0; i < data.length; i++) {
          jsonObj.push( {'text': data[i].name, 'type': 'est', 'url': '', 'date': '', 'collapsed': '',
           'itemId': data[i].publication_collection_id.toString() + '_' + data[i].id.toString(), } );
        }
        // Reset current item variables
        this.itemCurrent.Reset();
        // Deactivate nestable before reactivation
        $(this.elementSelector).nestable('destroy');
        // Populate the menu
        this.populateMenu(jsonObj);
      },
      err => { }
    );
  }

  updatePublications() {
    this.publicationsComponent.listPublications(this.data.projectName, this.data.publicationCollection);
  }
}

export interface Collection {
  collectionId: string;
  text: string;
  type: string;
}
