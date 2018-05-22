import {Component} from "@angular/core";

@Component({
    selector: 'app-grid-column-status',
    templateUrl: './grid-column-status.component.html'
})
export class GridColumnStatusComponent {
    params: any;

    agInit(params: any): void {
        this.params = params;
    }
}
