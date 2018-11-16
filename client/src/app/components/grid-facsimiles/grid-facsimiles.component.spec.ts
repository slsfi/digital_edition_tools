import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridFacsimilesComponent } from './grid-facsimiles.component';

describe('GridFacsimilesComponent', () => {
  let component: GridFacsimilesComponent;
  let fixture: ComponentFixture<GridFacsimilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridFacsimilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridFacsimilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
