import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridTagsComponent } from './grid-tags.component';

describe('GridTagsComponent', () => {
  let component: GridTagsComponent;
  let fixture: ComponentFixture<GridTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
