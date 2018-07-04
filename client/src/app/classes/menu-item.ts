// Declare $ as any to allow jquery
declare var $: any;

export class MenuItem {

  //types = ['Title', 'Subtitle', 'Heading 1', 'Heading 2', 'Heading 3', 'Link'];
  //types_id = ['title', 'subtitle', 'heading1',  'heading2',  'heading3',  'link'];
  types = [
    {'id': 'title', 'description': 'Title'},
    {'id': 'subtitle', 'description': 'Subtitle'},
    {'id': 'subtitle-link', 'description': 'Subtitle Link'},
    {'id': 'heading1', 'description': 'Heading 1'},
    {'id': 'heading2', 'description': 'Heading 2'},
    {'id': 'heading3', 'description': 'Heading 3'},
    {'id': 'link', 'description': 'Link'},
  ];
  type_default = 'link';

  id: string;
  url: string;
  type: string;
  title: string;
  element: any;
  editItem: boolean;
  newItem: boolean;

  constructor() {
    this.Reset();
  }

  Reset() {
    this.id = "";
    this.url = "";
    this.type = this.type_default;
    this.title = "";
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
    this.title = $(e).attr('data-title');
  }

  SetElement(e: any): boolean {
    if(this.id.length > 0 && this.title.length > 0) {
      $(e).attr('data-id', this.id);
      $(e).attr('data-url', this.url);
      $(e).attr('data-type', this.type);
      $(e).attr('data-title', this.title);
      $(e).children('.dd-handle').children('.dd-content').html(this.title);
      return true;
    }
    else
      return false;
  }

  AddElement(menuSelector: string): boolean {
    if(this.title.length > 0) {
      this.id = Date.now().toString(); // Create unique id for the element
      $(menuSelector).nestable('add', {"id":this.id,"url":this.url, "type":this.type,"content":this.title,"title":this.title});
      this.element = $(menuSelector).find('[data-id='+this.id+']'); // Get the created element
      return true;
    }
    else
      return false;
  }

}