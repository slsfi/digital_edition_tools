/*
Name: tool-menus
Description: Use this to create menus for table of contents etc.
Notes: This component uses nestable2, which is a jQuery plugin. 
Although it's not recommended to use jQuery with Angular, there
isn't any good drag and drop treeview system available for Angular.
*/

import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver/FileSaver';
import { DataService } from "../../services/data.service";
import { MenuItem } from "../../classes/menu-item";
import { environment } from '../../../environments/environment';

// Declare $ as any to allow nestable jquery
declare var $: any;

@Component({
  selector: 'app-tool-menus',
  templateUrl: './tool-menus.component.html',
  styleUrls: ['./tool-menus.component.css']
})
export class ToolMenusComponent implements OnInit {

  elementSelector: string = "#menu";
  itemCurrent: MenuItem;

  // Constructor, inject the instance of DataService
  constructor(private data: DataService) { }

  ngOnInit() {
    // Change active tool
    this.data.changeTool("Menus");
    // Create an instance of MenuItem
    this.itemCurrent = new MenuItem();
    // Create json data for nestable
    let jsonMenu: string = '[{"id":1,"url":1,"type":"link","content":"Ljungblommor","title":"Ljungblommor"},{"id":2,"url":2,"type":"link","content":"En ros","title":"En ros"},{"id":3,"url":3,"type":"heading1","content":"Andra dikter","title":"Andra dikter","children":[{"id":4,"url":4,"type":"link","content":"Våren","title":"Våren"},{"id":5,"url":5,"type":"link","foo":"bar","content":"Hösten","title":"Hösten"}]}]';
    // Populate the menu
    this.populateMenu(jsonMenu);
  }

  populateMenu(json: string) {
    // Set options for nestable
    let options = {
      'json': json,
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
    let jsonMenu: string = '[{"id":1,"url":1,"type":"link","content":"Ljungblommor","title":"Ljungblommor"},{"id":2,"url":2,"type":"link","content":"En ros","title":"En ros"},{"id":3,"url":3,"type":"heading1","content":"Andra dikter","title":"Andra dikter","children":[{"id":4,"url":4,"type":"link","content":"Våren","title":"Våren"},{"id":5,"url":5,"type":"link","foo":"bar","content":"Hösten","title":"Hösten"}]}]';
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

  onKeyUp(event: KeyboardEvent): void { 
    if (event.which == 13) { // Enter pressed
      // Add / update item
      if(this.itemCurrent.newItem)
        this.eventAddItem();
      else
        this.eventUpdateItem();
    } 
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
      let jsonMenu: string = reader.result;
      // Populate menu and reactivate nestable
      this.populateMenu(jsonMenu);
    }
    // Read the file as text
    reader.readAsText(files.item(0));
    // Reset value of file input so same file(s) can be selected again
    event.srcElement.value = null;
  }

  saveToClient() {
    // Serialize the menu and stringify it
    let stringToSave = JSON.stringify($(this.elementSelector).nestable('serialize'));
    // Create a blob from the string
    const blob = new Blob([stringToSave], { type: 'text/plain' });
    // Save the blob
    saveAs(blob, "menu.json");
  }

}