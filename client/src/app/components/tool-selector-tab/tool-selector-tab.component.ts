import { Component, OnInit, Input } from '@angular/core';
import {GridOptions, RowNode} from "ag-grid/main";

@Component({
  selector: 'app-tool-selector-tab',
  templateUrl: './tool-selector-tab.component.html',
  styleUrls: ['./tool-selector-tab.component.css']
})
export class ToolSelectorTabComponent implements OnInit {

  @Input() header: string;
  @Input() configuration: SelectorTabConfiguration;

  // Grid for occurences
  occGridOptions: GridOptions;
  occColumnDefs: any[]
  occRowData: any[];

  // Grid for data (persons, places, etc.)
  datGridOptions: GridOptions;
  datColumnDefs: any[]
  datRowData: any[];
  datSeachStringTimeout: any = null;
  datSearchString: string = "";
  datSearchId: string = "";
  datRowFound: boolean = false;
  datFocusRow: number = -1;

  // XML Document Nodes
  xmlNodes: Element[] = [];

  constructor() {
    // Set up the grids 
    this.occGridOptions = <GridOptions>{
      enableColResize: true,
      enableSorting: false,
      rowSelection: "single"
    };
    this.datGridOptions = <GridOptions>{
      enableColResize: true,
      enableSorting: false,
      rowSelection: "single",
      suppressRowClickSelection: true,
      suppressFocusAfterRefresh: false
    };

    // Set row style callback functions
    this.occGridOptions.getRowStyle = function(params) {
      if(!params.node.data.saved)
        return { color: 'blue' };
      else if(params.node.data.id.length > 0) {
        return { color: 'green' };
      }
    }

    // Set columns
    this.occColumnDefs = [
        {headerName: "Förekomst", field: "occurence"},
        {headerName: "Stycke", field: "section"},
        {headerName: "Id", field: "id"},
        {headerName: "Saved", field: "saved", hide: true}
    ];
    this.datColumnDefs = [
      {headerName: "Namn", field: "name"},
      {headerName: "Beskrivning", field: "description"},
      {headerName: "Id", field: "id", hide: true}
    ];

    // Set data
    this.datRowData = [
      {name: "Aiko Vanlandingham", description: "Description", id: "1"},
      {name: "Angella Miesner", description: "Description", id: "2"},
      {name: "Angelo Acoff", description: "Description", id: "3"},
      {name: "Annemarie Dillingham", description: "Description", id: "4"},
      {name: "Antione Morrisette", description: "Description", id: "5"},
      {name: "Archie Copper", description: "Description", id: "6"},
      {name: "Barbra Burkholder", description: "Description", id: "7"},
      {name: "Bethann Clatterbuck", description: "Description", id: "8"},
      {name: "Blondell Litman", description: "Description", id: "9"},
      {name: "Brigida Calvin", description: "Description", id: "10"},
      {name: "Chau Vanduyn", description: "Description", id: "11"},
      {name: "Christine Seto", description: "Description", id: "12"},
      {name: "Cleveland Kite", description: "Description", id: "13"},
      {name: "Coleman Barhorst", description: "Description", id: "14"},
      {name: "Daina Fillmore", description: "Description", id: "15"},
      {name: "Daine Presley", description: "Description", id: "16"},
      {name: "Debra Heitmann", description: "Description", id: "17"},
      {name: "Dorothy Castellano", description: "Description", id: "18"},
      {name: "Earle Becher", description: "Description", id: "19"},
      {name: "Elayne Borger", description: "Description", id: "20"},
      {name: "Eliseo Collinson", description: "Description", id: "21"},
      {name: "Eloise Frank", description: "Description", id: "22"},
      {name: "Elsy Gramling", description: "Description", id: "23"},
      {name: "Emelda Grisby", description: "Description", id: "24"},
      {name: "Felice Treloar", description: "Description", id: "25"},
      {name: "Felipa Rockefeller", description: "Description", id: "26"},
      {name: "Filiberto Deveaux", description: "Description", id: "27"},
      {name: "Francisco Fanelli", description: "Description", id: "28"},
      {name: "Garnett Meurer", description: "Description", id: "29"},
      {name: "Garret Linz", description: "Description", id: "30"},
      {name: "Grazyna Hepworth", description: "Description", id: "31"},
      {name: "Gwen Fricke", description: "Description", id: "32"},
      {name: "Jacqualine Oconnor", description: "Description", id: "33"},
      {name: "Jenniffer Slone", description: "Description", id: "34"},
      {name: "Jermaine Ospina", description: "Description", id: "35"},
      {name: "Jerrold Hargett", description: "Description", id: "36"},
      {name: "Jinny Regner", description: "Description", id: "37"},
      {name: "Joan Kysar", description: "Description", id: "38"},
      {name: "Joe Volk", description: "Description", id: "39"},
      {name: "Johnathan Hildebrant", description: "Description", id: "40"},
      {name: "Junko Runkle", description: "Description", id: "41"},
      {name: "Justin Ploss", description: "Description", id: "42"},
      {name: "Kacy Sinn", description: "Description", id: "43"},
      {name: "Kandra Narvaez", description: "Description", id: "44"},
      {name: "Katherina Ponce", description: "Description", id: "45"},
      {name: "Kristen Dudding", description: "Description", id: "46"},
      {name: "Krystle Hauge", description: "Description", id: "47"},
      {name: "Laine Crane", description: "Description", id: "48"},
      {name: "Lakesha Deasy", description: "Description", id: "49"},
      {name: "Larisa Eller", description: "Description", id: "50"},
      {name: "Lawrence Ertel", description: "Description", id: "51"},
      {name: "Lena Nader", description: "Description", id: "52"},
      {name: "Leoma Meighan", description: "Description", id: "53"},
      {name: "Linnie Juneau", description: "Description", id: "54"},
      {name: "Lonnie Eure", description: "Description", id: "55"},
      {name: "Lori Gwynn", description: "Description", id: "56"},
      {name: "Lorilee Difilippo", description: "Description", id: "57"},
      {name: "Love Beaufort", description: "Description", id: "58"},
      {name: "Lupe Micheals", description: "Description", id: "59"},
      {name: "Lyndia Carmichael", description: "Description", id: "60"},
      {name: "Ma Rote", description: "Description", id: "61"},
      {name: "Malik Ellenwood", description: "Description", id: "62"},
      {name: "Many Stansbury", description: "Description", id: "63"},
      {name: "Marcia Tsai", description: "Description", id: "64"},
      {name: "Marco Caulkins", description: "Description", id: "65"},
      {name: "Maribel Lafrance", description: "Description", id: "66"},
      {name: "Marth Hagaman", description: "Description", id: "67"},
      {name: "Maryland Fredrick", description: "Description", id: "68"},
      {name: "Mauricio Madero", description: "Description", id: "69"},
      {name: "Meryl Boster", description: "Description", id: "70"},
      {name: "Micki Yandell", description: "Description", id: "71"},
      {name: "Miyoko Mcdavis", description: "Description", id: "72"},
      {name: "Neely Victory", description: "Description", id: "73"},
      {name: "Neil Biddy", description: "Description", id: "74"},
      {name: "Nickole Steffens", description: "Description", id: "75"},
      {name: "Olive Corbin", description: "Description", id: "76"},
      {name: "Pamala Willcutt", description: "Description", id: "77"},
      {name: "Pamila Brandy", description: "Description", id: "78"},
      {name: "Pearlie Kindell", description: "Description", id: "79"},
      {name: "Quincy Bald", description: "Description", id: "80"},
      {name: "Reagan Wester", description: "Description", id: "81"},
      {name: "Rebbeca Lomanto", description: "Description", id: "82"},
      {name: "Remedios Leach", description: "Description", id: "83"},
      {name: "Rosalia Wise", description: "Description", id: "84"},
      {name: "Sherry Parnell", description: "Description", id: "84"},
      {name: "Siobhan Bruton", description: "Description", id: "86"},
      {name: "Stanley Henke", description: "Description", id: "87"},
      {name: "Tawanna Millener", description: "Description", id: "88"},
      {name: "Tommye Duque", description: "Description", id: "89"},
      {name: "Tori Regal", description: "Description", id: "90"},
      {name: "Tova Thacker", description: "Description", id: "91"},
      {name: "Twana Classen", description: "Description", id: "92"},
      {name: "Twila Sojka", description: "Description", id: "93"},
      {name: "Vernice Rosas", description: "Description", id: "94"},
      {name: "Violet Valles", description: "Description", id: "95"},
      {name: "Wanetta Betz", description: "Description", id: "96"},
      {name: "Werner Shurtliff", description: "Description", id: "97"},
      {name: "Wilhelmina Nitti", description: "Description", id: "98"},
      {name: "Winter Avants", description: "Description", id: "99"},
      {name: "Yuki Kish", description: "Description", id: "100"}
    ];
  }

  ngOnInit() {
  }

  occOnGridReady(event: any) {
  }

  datOnGridReady(event: any) {
  }

  occOnKeyDown(event: KeyboardEvent) {
    if(event.key.toLowerCase() === 'arrowup' || event.key.toLowerCase() === 'arrowdown') {
      this.occGridOptions.api.selectIndex(this.occGridOptions.api.getFocusedCell().rowIndex, false, false);
    }
  }

  datLoadOccurences(xmlDoc: XMLDocument) {
    // Clear the occurences grid and the xml node list
    this.occRowData = [];
    this.xmlNodes = [];

    // Get the nodes using XPath defined in configuration (environment)
    let xp : XPathResult = xmlDoc.evaluate(this.configuration.elementsXPath, xmlDoc.documentElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

    //this.xmltest = this.xmlDoc.getElementsByTagName("p")[0].innerHTML;
    
    let node: Element = xp.iterateNext() as Element;
    while (node) {
      this.xmlNodes.push(node);
      node = xp.iterateNext() as Element;
    }

    this.xmlNodes.forEach(element => {
      let id = element.getAttribute(this.configuration.attribute);
      if(id === null)
        id = "";
      this.occRowData.push({occurence: element.textContent, section: element.parentElement.textContent.substring(0, 50), id: id, saved: true});
    });
  }

  datOnKeyDown(event: KeyboardEvent) {
    // Check for printable character (excluding space)
    if(event.key.length === 1 && event.key !== ' ') {
      // Add letter/symbol to search string
      this.datSearchString += event.key.toLowerCase();
      // Set datRowFound to false to enable search
      this.datRowFound = false;
      // Select first node with search criteria
      this.datGridOptions.api.forEachNode( (node) => {
        // Skip if row with criteria has already been found
        if(!this.datRowFound) {
          if (node.data.name.toLowerCase().startsWith(this.datSearchString) ) {
            // Select and show node
            this.datGotoNode(node, true, false);
          }
        }
      });
      // Clear previous timeout
      clearTimeout(this.datSeachStringTimeout);
      // Clear search string after a second
      this.datSeachStringTimeout = setTimeout(() => {
        this.datSearchString="";
      }, 1000);
    }
    else if(event.key.toLowerCase() === 'enter') {
      this.datSetId();
    }
  }

  datSetId() {
    // Check if a row is selected in the occurences grid
    if(this.occGridOptions.api.getSelectedRows().length > 0) {
      // Select current row
      let _rowIndex = this.datGridOptions.api.getFocusedCell().rowIndex;
      this.datGridOptions.api.selectIndex(_rowIndex, false, false);
      // Get id of selected row
      let rowSource = this.datGridOptions.api.getSelectedRows()[0];
      // Get selected row of occurences grid
      //let model = this.occGridOptions.api.getModel();
      let rowDest = this.occGridOptions.api.getSelectedRows()[0];
      // Copy id from data to occurences and set 'saved' to false
      rowDest.id = rowSource.id;
      rowDest.saved = false;
      // Set id of xml element
      this.xmlNodes[_rowIndex].setAttribute(this.configuration.attribute, rowSource.id);
      // Refresh occurences grid
      this.occGridOptions.api.redrawRows();
      // Select next occurence
      let rowNode = this.occGridOptions.api.getSelectedNodes()[0];
      this.occGridOptions.api.selectIndex(rowNode.childIndex+1, false, false);
    }
  }

  occOnSelectionChanged(event: any) {
    let node = this.occGridOptions.api.getSelectedNodes()[0];
    if(node.data.id.length > 0) {
      // Set id to search for in data grid
      this.datSearchId = node.data.id;
      // Enable searching
      this.datRowFound = false;
      // Select node with id in data grid
      this.datGridOptions.api.forEachNode( (node) => {
        // Skip if row with criteria has already been found
        if(!this.datRowFound) {
          if (node.data.id === this.datSearchId) {
            // Select and show rowNode in data grid
            this.datGotoNode(node, false, true);
          }
        }
      });
    }
    else
      // Deselect all rows if id is empty
      this.datGridOptions.api.deselectAll();
  }

  datGotoNode(node: RowNode, focus: boolean, select: boolean) {
    // Ensure row is visible
    this.datGridOptions.api.ensureIndexVisible(node.rowIndex, 'middle');
    // Select row
    if(select)
      node.setSelected(true);
    // For some reason, focus is lost if we set focused cell directly after ensureIndexVisible, we need to use a timeout instead
    if(focus) {
      this.datFocusRow = node.rowIndex;
      setTimeout(() => {
        this.datGridOptions.api.setFocusedCell(this.datFocusRow, this.datColumnDefs[0].field);
      }, 50);
    }
    // "Hack" to quit searching after first row with criteria is found, there is no functionality to exit forEachNode prematurely.
    this.datRowFound = true;
  }

  datOnCellDoubleClicked(event: any) {
    this.datSetId();
  }

  buttonClick(event: any) {
    this.occRowData = [
      {occurence: "Zacharias", section: "Test1s iposfo s efposef oseopf opseifop isfise fipi", id: "1", saved: true},
      {occurence: "Johanna", section: "Test2 lfpnk optkop kopkaopfe koapkfp aopfk owfo kawfk", id: "", saved: true},
      {occurence: "Isabella", section: "Test3a fakwfo koawfko paofpk opa kwfokawfk oako ka fo awkfpo", id: "56", saved: true}
    ];
    alert(this.configuration.name);
  }

}

interface SelectorTabConfiguration {
  name: string,
  descriptionField: string,
  sortByColumn: number,
  elements: string[],
  elementsXPath: string,
  attribute: string
}
