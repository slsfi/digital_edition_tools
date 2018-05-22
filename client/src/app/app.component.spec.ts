import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { GridColumnRedComponent } from './components/grid-column-red/grid-column-red.component';
import { AgGridModule } from "ag-grid-angular";
import { GridPublicationsComponent } from "./components/grid-publications/grid-publications.component";

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AgGridModule.withComponents(
            [GridColumnRedComponent]
        )
      ],
      declarations: [
        AppComponent, GridPublicationsComponent, GridColumnRedComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
  }));
});
