import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {AppComponent} from "../../app.component";
import {GridPublicationsComponent} from "./grid-publications.component";
import {AgGridModule} from "ag-grid-angular";
import {GridColumnStatusComponent} from "../grid-column-status/grid-column-status.component";

describe('MyGridApplicationComponent', () => {
    let component: GridPublicationsComponent;
    let fixture: ComponentFixture<GridPublicationsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AgGridModule.withComponents(
                    [GridColumnStatusComponent]
                )
            ],
            declarations: [
                AppComponent, GridPublicationsComponent, GridColumnStatusComponent
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GridPublicationsComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
    });

    it('should render title in a h1 tag', async(() => {
        fixture.detectChanges();

        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('Simple ag-Grid Angular Example');
    }));

    it('grid API is not available until  `detectChanges`', () => {
        expect(component.gridOptions.api).not.toBeTruthy();
    });

    it('grid API is available after `detectChanges`', () => {
        fixture.detectChanges();
        expect(component.gridOptions.api).toBeTruthy();
    });

    it('select all button selects all rows', () => {
        fixture.detectChanges();
        component.selectAllRows();
        expect(component.gridOptions.api.getSelectedNodes().length).toEqual(3);
    });

});
