import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridTextsComponent } from './grid-texts.component';

describe('GridTextsComponent', () => {
  let component: GridTextsComponent;
  let fixture: ComponentFixture<GridTextsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridTextsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridTextsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
