// Declare $ as any to allow jquery
declare var $: any;

export class MenuItem {

  types = ['Header', 'Internal Link', 'External Link'];

  id: string;
  url: string;
  type: number;
  header: string;
  element: any;
  editItem: boolean;
  newItem: boolean;

  constructor() {
    this.Reset();
  }

  Reset() {
    this.id = "";
    this.url = "";
    this.type = MenuItemType.InternalLink;
    this.header = "";
    this.element = undefined;
    this.editItem = false;
    this.newItem = false;
  }

  GetElement(e: any) {
    // Store jQuery element
    this.element = e;
    // Get data from jQuery element
    this.id = $(e).attr('data-id');
    this.url = $(e).attr('data-url');
    this.type = $(e).attr('data-type');
    this.header = $(e).attr('data-header');
  }

  SetElement(e: any): boolean {
    if(this.id.length > 0 && this.url.length > 0 && this.header.length > 0) {
      $(e).attr('data-id', this.id);
      $(e).attr('data-url', this.url);
      $(e).attr('data-type', this.type);
      $(e).attr('data-header', this.header);
      $(e).children('.dd-handle').children('.dd-content').html(this.header);
      return true;
    }
    else
      return false;
  }

  AddElement(menuSelector: string): boolean {
    if(this.url.length > 0 && this.header.length > 0) {
      this.id = Date.now().toString(); // Create unique id for the element
      $(menuSelector).nestable('add', {"id":this.id,"url":this.url, "type":this.type,"content":this.header,"header":this.header});
      this.element = $(menuSelector).find('[data-id='+this.id+']'); // Get the created element
      return true;
    }
    else
      return false;
  }

}

enum MenuItemType {
  Header,
  InternalLink,
  ExternalLink
}