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
    {'id': 'est', 'description': 'Reading text'},
    {'id': 'var', 'description': 'Version'},
    {'id': 'ms',  'description': 'Manuscript'},
  ];
  type_default = 'link';

  id: string;
  itemId: string;
  type: string;
  text: string;
  element: any;
  editItem: boolean;
  newItem: boolean;

  constructor() {
    this.Reset();
  }

  Reset() {
    this.id = "";
    this.itemId = "";
    this.type = this.type_default;
    this.text = "";
    this.element = undefined;
    this.editItem = false;
    this.newItem = false;
  }

  GetElement(e: any) {
    // Store jQuery element
    this.element = e;
    // Get data from jQuery element
    this.id = $(e).attr('data-id');
    this.itemId = $(e).attr('data-itemid');
    this.type = $(e).attr('data-type');
    this.text = $(e).attr('data-text');
  }

  SetElement(e: any): boolean {
    if(this.id.length > 0 && this.text.length > 0) {
      $(e).attr('data-id', this.id);
      $(e).attr('data-itemid', this.itemId);
      $(e).attr('data-type', this.type);
      $(e).attr('data-text', this.text);
      $(e).children('.dd-handle').children('.dd-content').html(this.text);
      return true;
    }
    else
      return false;
  }

  AddElement(menuSelector: string): boolean {
    if(this.text.length > 0) {
      this.id = Date.now().toString(); // Create unique id for the element
      $(menuSelector).nestable('add', {"id":this.id,"itemid":this.itemId, "type":this.type,"content":this.text,"text":this.text});
      this.element = $(menuSelector).find('[data-id='+this.id+']'); // Get the created element
      return true;
    }
    else
      return false;
  }

}