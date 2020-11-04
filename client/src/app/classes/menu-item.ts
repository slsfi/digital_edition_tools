// Declare $ as any to allow jquery
declare var $: any;

export class MenuItem {

  // types = ['Title', 'Subtitle', 'Heading 1', 'Heading 2', 'Heading 3', 'Link'];
  // types_id = ['title', 'subtitle', 'heading1',  'heading2',  'heading3',  'link'];
  types = [
    {'id': 'title', 'description': 'Title'},
    {'id': 'subtitle', 'description': 'Subtitle'},
    {'id': 'subtitle-link', 'description': 'Subtitle Link'},
    {'id': 'heading1', 'description': 'Heading 1'},
    {'id': 'heading2', 'description': 'Heading 2'},
    {'id': 'heading3', 'description': 'Heading 3'},
    {'id': 'link', 'description': 'Link'},
    {'id': 'est', 'description': 'Reading text'},
    {'id': 'var', 'description': 'Version'},
    {'id': 'ms',  'description': 'Manuscript'},
    {'id': 'hidden',  'description': 'Hidden'},
  ];
  type_default = 'link';

  id: string;
  url: string;
  date: string;
  itemId: string;
  type: string;
  text: string;
  collapsed: boolean;
  element: any;
  editItem: boolean;
  newItem: boolean;

  constructor() {
    this.Reset();
  }

  Reset() {
    this.id = '';
    this.url = '';
    this.itemId = '';
    this.date = '';
    this.type = this.type_default;
    this.text = '';
    this.element = undefined;
    this.editItem = false;
    this.collapsed = true;
    this.newItem = false;
  }

  GetElement(e: any) {
    // Store jQuery element
    this.element = e;
    // Get data from jQuery element
    this.id = $(e).attr('data-id');
    this.url = $(e).attr('data-url');
    this.date = $(e).attr('data-date');
    this.itemId = $(e).attr('data-itemId');
    this.type = $(e).attr('data-type');
    this.text = $(e).attr('data-text');
    this.collapsed = $(e).attr('data-collapsed');
  }

  SetElement(e: any): boolean {
    if (this.id.length > 0 && this.text.length > 0) {
      $(e).attr('data-id', this.id);
      $(e).attr('data-url', this.url);
      $(e).attr('data-date', this.date);
      $(e).attr('data-itemId', this.itemId);
      $(e).attr('data-type', this.type);
      $(e).attr('data-text', this.text);
      $(e).attr('data-collapsed', this.collapsed);
      $(e).children('.dd-handle').children('.dd-content').html(this.text);
      return true;
    } else {
      return false;
    }
  }

  AddElement(menuSelector: string): boolean {
    if (this.text.length > 0) {
      this.id = Date.now().toString(); // Create unique id for the element
      $(menuSelector).nestable('add', {'id': this.id, 'url': this.url, 'itemId': this.itemId, 'date': this.date, 'collapsed': this.date,
      'type': this.type, 'content': this.text, 'text': this.text});
      this.element = $(menuSelector).find('[data-id=' + this.id + ']'); // Get the created element
      return true;
    } else {
      return false;
    }
  }

}
