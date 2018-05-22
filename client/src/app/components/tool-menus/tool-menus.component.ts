/*
Name: tool-menus
Description: Use this to create menus for table of contents etc.
Notes: This component uses nestable2, which is a jQuery plugin. 
Although it's not recommended to use jQuery with Angular, there
isn't any good drag and drop treeview system available for Angular.
*/

import { Component, OnInit } from '@angular/core';
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
    let jsonMenu: string = '[{"id":1,"url":1,"type":1,"content":"Ljungblommor","header":"Ljungblommor"},{"id":2,"url":2,"type":1,"content":"En ros","header":"En ros"},{"id":3,"url":3,"type":0,"content":"Andra dikter","header":"Andra dikter","children":[{"id":4,"url":4,"type":2,"content":"Våren","header":"Våren"},{"id":5,"url":5,"type":1,"foo":"bar","content":"Hösten","header":"Hösten"}]}]';
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
    let jsonMenu: string = '[{"id":1,"url":1,"type":1,"content":"Ljungblommor","header":"Ljungblommor"},{"id":2,"url":2,"type":1,"content":"En ros","header":"En ros"},{"id":3,"url":3,"type":0,"content":"Andra dikter","header":"Andra dikter","children":[{"id":4,"url":4,"type":2,"content":"Våren","header":"Våren"},{"id":5,"url":5,"type":1,"foo":"bar","content":"Hösten","header":"Hösten"}]}]';
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
}