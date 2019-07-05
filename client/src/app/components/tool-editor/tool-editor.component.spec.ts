import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolEditorComponent } from './tool-editor.component';

describe('ToolEditorComponent', () => {
  let component: ToolEditorComponent;
  let fixture: ComponentFixture<ToolEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
