/*
Name: tool-toc
Description: Use this to create table of contents for publication collections
Notes: This component uses nestable2, which is a jQuery plugin. 
Although it's not recommended to use jQuery with Angular, there
isn't any good drag and drop treeview system available for Angular.
*/

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { saveAs } from 'file-saver/FileSaver';
import { DataService } from "../../services/data.service";
import { MenuItem } from "../../classes/menu-item";
import { environment } from '../../../environments/environment';
import { DialogPublicationCollectionComponent } from '../dialog-publication-collection/dialog-publication-collection.component';

// Declare $ as any to allow nestable jquery
declare var $: any;

@Component({
  selector: 'app-tool-toc',
  templateUrl: './tool-toc.component.html',
  styleUrls: ['./tool-toc.component.css']
})
export class ToolTOCComponent implements OnInit {

  elementSelector: string = "#menu";
  itemCurrent: MenuItem;

  // Constructor, inject the instance of DataService
  constructor(private data: DataService, public dialog: MatDialog) { }

  ngOnInit() {
    // Change active tool
    this.data.changeTool("TOC");
    // Create an instance of MenuItem
    this.itemCurrent = new MenuItem();
    // Create json data for nestable
    let jsonMenu: string = '[{"id":1,"itemId":1,"type":"est","content":"Ljungblommor","text":"Ljungblommor"},{"id":2,"itemId":2,"type":"est","content":"En ros","text":"En ros"},{"id":3,"itemId":3,"type":"heading1","content":"Andra dikter","text":"Andra dikter","children":[{"id":4,"itemId":4,"type":"est","content":"Våren","text":"Våren"},{"id":5,"itemId":5,"type":"est","foo":"bar","content":"Hösten","text":"Hösten"}]}]';
    // Populate the menu
    this.populateMenu(jsonMenu);
  }

  populateMenu(json: string) {

    // Convert json string to an object so it can be parsed
    let oJson = JSON.parse(json);
    // Copy the text properties to content properties needed by nestable
    this.processJsonForLoad(oJson, '1');

    // Set options for nestable
    let options = {
      'json': JSON.stringify(oJson),
      // We need to create the callback with an arrow function (=>) to maintain correct scope
      callback: (l,e) => {
        this.callbackItemMoved(l,e);
      }
    };
    // Initialise nestable with options (including data)
    $(this.elementSelector).nestable(options);
  }

  callbackItemMoved(l:any, e:any) {
    // Update current menut item from jQuery element
    this.itemCurrent.GetElement(e);
    // Set edit flags
    this.itemCurrent.editItem = true;
    this.itemCurrent.newItem = false;
  }

  eventPopulate() {
    // Reset current item variables
    this.itemCurrent.Reset();
    // Deactivate nestable before reactivation
    $(this.elementSelector).nestable("destroy");
    // Create json data for nestable
    let jsonMenu: string = '[{"itemId":1,"type":"est","content":"Ljungblommor","text":"Ljungblommor"},{"itemId":2,"type":"est","content":"En ros","text":"En ros"},{"itemId":3,"type":"heading1","content":"Andra dikter","text":"Andra dikter","children":[{"itemId":4,"type":"est","content":"Våren","text":"Våren"},{"itemId":5,"type":"est","foo":"bar","content":"Hösten","text":"Hösten"}]}]';
    // Populate menu and reactivate nestable
    this.populateMenu(jsonMenu);
  }

  eventNewItem() {
    // Reset current item variables
    this.itemCurrent.Reset();
    // Set new item flag
    this.itemCurrent.newItem = true;
  }

  eventAddItem() {
    // Add item to menu
    let added = this.itemCurrent.AddElement(this.elementSelector);
    // Update edit flags
    if(added) {
      this.itemCurrent.newItem = false;
      this.itemCurrent.editItem = true;
    }
  }

  eventUpdateItem() {
    // Update current item
    this.itemCurrent.SetElement(this.itemCurrent.element);
  }

  eventDeleteItem() {
    // Delete current item
    $(this.elementSelector).nestable('remove', this.itemCurrent.id);
    // Reset current item variables
    this.itemCurrent.Reset();
  }

  collapseAll() {
    $(this.elementSelector).nestable('collapseAll');
  }

  expandAll() {
    $(this.elementSelector).nestable('expandAll');
  }

  onKeyUp(event: KeyboardEvent): void { 
    if (event.which == 13) { // Enter pressed
      // Add / update item
      if(this.itemCurrent.newItem)
        this.eventAddItem();
      else
        this.eventUpdateItem();
    } 
  }

  loadFromServer() {
    this.showPublicationCollectionDialog("Select Collection");
  }

  onFileInput(event: any) {
    // Get the list of selected files
    let files: FileList = event.target.files;
    // Create a file reader and create a callback for the file read
    let reader = new FileReader();
    reader.onload = () => {
      // Reset current item variables
      this.itemCurrent.Reset();
      // Deactivate nestable before reactivation
      $(this.elementSelector).nestable("destroy");
      // Create json data for nestable
      let jsonMenu: string = reader.result.toString();
      // Populate menu and reactivate nestable
      this.populateMenu(jsonMenu);
    }
    // Read the file as text
    reader.readAsText(files.item(0));
    // Reset value of file input so same file(s) can be selected again
    event.srcElement.value = null;
  }

  saveToClient() {
    // Get menu as a json object
    let jsonObj = $(this.elementSelector).nestable('serialize');
    // Remove the 'id' properties from the json object
    this.processJsonForSave(jsonObj);
    // Stringify the json object
    let stringToSave = JSON.stringify(jsonObj);
    // Create a blob from the string
    const blob = new Blob([stringToSave], { type: 'text/plain' });
    // Save the blob
    saveAs(blob, "menu.json");
  }

  processJsonForLoad(obj: any, menuItemId: string)
  {
    var k;
    if (obj instanceof Object) 
    {
      // Copy 'text' property to a 'content' property
      if(obj.hasOwnProperty('text'))
        obj.content = obj.text;

      //if(Array.isArray(obj))
      //  alert(JSON.stringify(obj));

      // Add an id property
      obj.id = menuItemId;

      // Recursive call for child objects
      var i: number = 1;
      for (k in obj){
        if (obj.hasOwnProperty(k)){
          // There seems to be a small issue with an uneccessary level (created for json array) when creating the 
          // menuItemIds, but it works. The most important is that the ids are unique. When creating new items, a
          // timestamp will be used as id so that won't create conficts.
          this.processJsonForLoad( obj[k], menuItemId+i.toString() );  
        }   
        i++;          
      }
    }
  }

  processJsonForSave(obj: any)
  {
    var k;
    if (obj instanceof Object) 
    {
      // Delete the possible 'id' property
      if(obj.hasOwnProperty('id'))
        delete obj.id;

      // Recursive call for child objects
      for (k in obj){
        if (obj.hasOwnProperty(k)){
          this.processJsonForSave( obj[k] );  
        }                
      }
    }
  }

  showPublicationCollectionDialog(header: string) {
    const dialogRef = this.dialog.open(DialogPublicationCollectionComponent, {
      width: '700px',
      data: header
    });

    dialogRef.afterClosed().subscribe(result => {
      alert('Ok');
    });
  }

}