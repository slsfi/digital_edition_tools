import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolTOCComponent } from './tool-toc.component';

describe('ToolTOCComponent', () => {
  let component: ToolTOCComponent;
  let fixture: ComponentFixture<ToolTOCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolTOCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolTOCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
